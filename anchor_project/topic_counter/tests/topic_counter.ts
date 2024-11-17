import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TopicCounter } from "../target/types/topic_counter";
import { PublicKey } from '@solana/web3.js';
import { assert, expect } from "chai";

describe("topic_counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.TopicCounter as Program<TopicCounter>;

  describe("deploy a program", () => {
    it("when topic_storage is intiailized!", async () => {
      const admin = anchor.web3.Keypair.generate()
      const [topicStoragePda, bump] = PublicKey.findProgramAddressSync([
        Buffer.from("topic_storage")
      ], program.programId)
  
      await airdrop(provider.connection, admin.publicKey)
  
      const tx = await program.methods
      .deployProgram()
      .accounts({
        admin: admin.publicKey,
        topicStorage: topicStoragePda,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([admin])
      .rpc({"commitment": "confirmed"})
  
      console.log("Your transaction signature", tx);
      
      const topicStorageAccount = await program.account.topicStorage.fetch(topicStoragePda)
      assert.equal(topicStorageAccount.totalTopics.toNumber(), 0)
    })
  
    it("when topic_storage is intiailized twice!", async () => {
      const admin = anchor.web3.Keypair.generate()
      const [topicStoragePda, bump] = PublicKey.findProgramAddressSync([
        Buffer.from("topic_storage")
      ], program.programId)
  
      await airdrop(provider.connection, admin.publicKey)
  
      try {
        const tx = await program.methods
      .deployProgram()
      .accounts({
        admin: admin.publicKey,
        topicStorage: topicStoragePda,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([admin])
      .rpc({"commitment": "confirmed"})
  
      const tx2 = await program.methods
      .deployProgram()
      .accounts({
        admin: admin.publicKey,
        topicStorage: topicStoragePda,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([admin])
      .rpc({"commitment": "confirmed"})
      assert.fail("The instruction operation must be failed")
      } catch(_error) {
        assert.isNotNull(_error)
      }
    })
  })

  describe("create a topic", () => {
    it("when create_topic returns successfully!", async () => {
      const topicOwner = anchor.web3.Keypair.generate()
      const topicTitle = "This is a topic title"
      const topicContent = "This is a topic content"
  
      const [topicStoragePda, bump] = PublicKey.findProgramAddressSync([Buffer.from("topic_storage")], program.programId)
      const [topicPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("topic"),
          Buffer.from(topicTitle),
          topicOwner.publicKey.toBuffer()
        ],
        program.programId
      )
  
      await airdrop(provider.connection, topicOwner.publicKey)
  
      const tx = await program.methods
      .createTopic(topicTitle, topicContent)
      .accounts({
        topicOwner: topicOwner.publicKey,
        topicAccount: topicPda,
        topicStorage: topicStoragePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([topicOwner])
      .rpc({"commitment": "confirmed"})
     
      console.log("Your transaction signature", tx);
  
      await checkTopicTitleAndContent(program, topicPda, topicTitle, topicContent)
  
      let topicStorage = await program.account.topicStorage.fetch(topicStoragePda)
      assert.equal(topicStorage.totalTopics.toNumber(), 1)
    });
  
    it("when create_topic returns failed with TitleTooLong!", async () => {
      const topicOwner = anchor.web3.Keypair.generate()
      const topicTitle = "Lorem ipsum dolor sit amet, conse"
      const topicContent = "This is a topic content"
      const [topicStoragePda, bump] = PublicKey.findProgramAddressSync([Buffer.from("topic_storage")], program.programId)
      try {
        const [topicPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("topic"),
            Buffer.from(topicTitle),
            topicOwner.publicKey.toBuffer()
          ],
          program.programId
        )
  
        await airdrop(provider.connection, topicOwner.publicKey)
  
        const tx = await program.methods
          .createTopic(topicTitle, topicContent)
          .accounts({
            topicOwner: topicOwner.publicKey,
            topicAccount: topicPda,
            topicStorage: topicStoragePda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([topicOwner])
          .rpc({"commitment": "confirmed"})
      } catch(_error) {
        assert.strictEqual(_error.message, "Max seed length exceeded");
      }
    });
  
    it("when create_topic returns failed with ContentTooLong!", async () => {
      const topicOwner = anchor.web3.Keypair.generate()
      const topicTitle = "Lorem ipsum dolor sit amet, con"
      const topicContent = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qua"
      const [topicStoragePda, bump] = PublicKey.findProgramAddressSync([Buffer.from("topic_storage")], program.programId)
      const [topicPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("topic"),
          Buffer.from(topicTitle),
          topicOwner.publicKey.toBuffer()
        ],
        program.programId
      )
      await airdrop(provider.connection, topicOwner.publicKey)
      
      try {
        const tx = await program.methods
          .createTopic(topicTitle, topicContent)
          .accounts({
            topicOwner: topicOwner.publicKey,
            topicAccount: topicPda,
            topicStorage: topicStoragePda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([topicOwner])
          .rpc({"commitment": "confirmed"})
      } catch(_error) {
        const anchorError = anchor.AnchorError.parse(_error.logs);
        assert.equal(anchorError.error.errorCode.code, "ContentTooLong")
      }
    });

    it("prevent the program to create the duplicate topics from one single user", async () => {
      const topicOwner = anchor.web3.Keypair.generate()
      const topicTitle = "This is a topic title"
      const topicContent = "This is a topic content"
  
      const [topicStoragePda, bump] = PublicKey.findProgramAddressSync([Buffer.from("topic_storage")], program.programId)
      const [topicPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("topic"),
          Buffer.from(topicTitle),
          topicOwner.publicKey.toBuffer()
        ],
        program.programId
      )
  
      await airdrop(provider.connection, topicOwner.publicKey)
  
      const tx = await program.methods
      .createTopic(topicTitle, topicContent)
      .accounts({
        topicOwner: topicOwner.publicKey,
        topicAccount: topicPda,
        topicStorage: topicStoragePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([topicOwner])
      .rpc({"commitment": "confirmed"})

      try {
        const tx2 = await program.methods
      .createTopic(topicTitle, topicContent)
      .accounts({
        topicOwner: topicOwner.publicKey,
        topicAccount: topicPda,
        topicStorage: topicStoragePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([topicOwner])
      .rpc({"commitment": "confirmed"})

      assert.fail("This should fail")
      } catch(_error) {
        assert.isNotEmpty(_error)
      }
    });

    it("allow the program to create the duplicate topics from different users", async () => {
      const topicOwner1 = anchor.web3.Keypair.generate()
      const topicOwner2 = anchor.web3.Keypair.generate()
      const topicTitle = "This is a topic title"
      const topicContent = "This is a topic content"
  
      const [topicStoragePda, bump] = PublicKey.findProgramAddressSync([Buffer.from("topic_storage")], program.programId)
      const [topicPda1] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("topic"),
          Buffer.from(topicTitle),
          topicOwner1.publicKey.toBuffer()
        ],
        program.programId
      )
      const [topicPda2] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("topic"),
          Buffer.from(topicTitle),
          topicOwner2.publicKey.toBuffer()
        ],
        program.programId
      )
  
      await airdrop(provider.connection, topicOwner1.publicKey)
      await airdrop(provider.connection, topicOwner2.publicKey)
  
      try {
        const tx1 = await program.methods
      .createTopic(topicTitle, topicContent)
      .accounts({
        topicOwner: topicOwner1.publicKey,
        topicAccount: topicPda1,
        topicStorage: topicStoragePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([topicOwner1])
      .rpc({"commitment": "confirmed"})

      const tx2 = await program.methods
      .createTopic(topicTitle, topicContent)
      .accounts({
        topicOwner: topicOwner2.publicKey,
        topicAccount: topicPda2,
        topicStorage: topicStoragePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([topicOwner2])
      .rpc({"commitment": "confirmed"})
      } catch(_error) {
        console.log(_error);
        
        assert.fail("This shouldn't have failed")
      }
    });
  })
});

async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}

async function checkTopicTitleAndContent(
  program: anchor.Program<TopicCounter>,
  topicPublicKey: PublicKey,
  title: string,
  content: string,
) {
  let topicData = await program.account.topic.fetch(topicPublicKey)

  const utf8ByteArray_title = stringToUtf8ByteArray(title);
  const paddedByteArray_title = padByteArrayWithZeroes(utf8ByteArray_title, 32);
  assert.strictEqual(topicData.title.toString(), paddedByteArray_title.toString());

  const utf8ByteArray_content = stringToUtf8ByteArray(content);
  const paddedByteArray_content = padByteArrayWithZeroes(utf8ByteArray_content, 200);
  assert.strictEqual(topicData.content.toString(), paddedByteArray_content.toString());
}

function stringToUtf8ByteArray(inputString: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(inputString);
}

// Function to pad a byte array with zeroes to a specified length
function padByteArrayWithZeroes(byteArray: Uint8Array, length: number): Uint8Array {
  if (byteArray.length >= length) {
    return byteArray;
  }

  const paddedArray = new Uint8Array(length);
  paddedArray.set(byteArray, 0);
  return paddedArray;
}