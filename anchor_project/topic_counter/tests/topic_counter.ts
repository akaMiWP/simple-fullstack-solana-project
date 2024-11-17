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
    .rpc({skipPreflight: true})

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
    .rpc({skipPreflight: true})

    const tx2 = await program.methods
    .deployProgram()
    .accounts({
      admin: admin.publicKey,
      topicStorage: topicStoragePda,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([admin])
    .rpc({skipPreflight: true})
    assert.fail("The instruction operation must be failed")
    } catch(_error) {
      assert.isNotNull(_error)
    }
  })

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
    .rpc({skipPreflight: true})
   
    console.log("Your transaction signature", tx);

    await checkTopicTitleAndContent(program, topicPda, topicTitle, topicContent)

    let topicStorage = await program.account.topicStorage.fetch(topicStoragePda)
    assert.equal(topicStorage.totalTopics.toNumber(), 1)
  });

  // it("when create_topic returns failed because of topic title too long!", async () => {
  //   const user = anchor.web3.Keypair.generate()
  //   const topicAccount = anchor.web3.Keypair.generate()
  //   const topicTitle = "Lorem ipsum dolor sit amet, conse"
  //   const topicContent = "This is a topic content"

  //   await airdrop(provider.connection, user.publicKey)

  //   try {
  //     const tx = await program.methods
  //     .createTopic(topicTitle, topicContent)
  //     .accounts({
  //       topicOwner: user.publicKey,
  //       topicAccount: topicAccount.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([user, topicAccount])
  //     .rpc({skipPreflight: true})

  //     assert.fail("The instruction operation must be failed")
  //   } catch(_error) {
  //     assert.isNotNull(_error)
  //   }
  // });

  // it("when create_topic returns failed because of topic content too long!", async () => {
  //   const user = anchor.web3.Keypair.generate()
  //   const topicAccount = anchor.web3.Keypair.generate()
  //   const topicTitle = "This is a topic title"
  //   const topicContent = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qua"

  //   await airdrop(provider.connection, user.publicKey)

  //   try {
  //     const tx = await program.methods
  //     .createTopic(topicTitle, topicContent)
  //     .accounts({
  //       topicOwner: user.publicKey,
  //       topicAccount: topicAccount.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([user, topicAccount])
  //     .rpc({skipPreflight: true})

  //     assert.fail("The instruction operation must be failed")
  //   } catch(_error) {
  //     assert.isNotNull(_error)
  //   }
  // });
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