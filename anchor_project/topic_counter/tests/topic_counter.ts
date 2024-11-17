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

  it("when create_topic returns successfully!", async () => {
    const user = anchor.web3.Keypair.generate()
    const topicAccount = anchor.web3.Keypair.generate()
    const topicTitle = "This is a topic title"
    const topicContent = "This is a topic content"

    // const topicTitle = Buffer.from("My Topic", "utf-8")
    // const contentTitle = Buffer.from("My Content", "utf-8")
    // const [topicKey, topicBump] = PublicKey.findProgramAddressSync([
    //   topicOwner.publicKey.toBuffer(),
    //   topicTitle,
    //   contentTitle
    // ], program.programId)

    await airdrop(provider.connection, user.publicKey)

    const tx = await program.methods
    .createTopic(topicTitle, topicContent)
    .accounts({
      topicOwner: user.publicKey,
      topicAccount: topicAccount.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([user, topicAccount])
    .rpc({skipPreflight: true})
   
    console.log("Your transaction signature", tx);

    const fetchedTopicAccount = await program.account.topic.fetch(topicAccount.publicKey);

    expect(fetchedTopicAccount.title, topicTitle)
    expect(fetchedTopicAccount.content, topicContent)
  });

  it("when create_topic returns failed because of topic title too long!", async () => {
    const user = anchor.web3.Keypair.generate()
    const topicAccount = anchor.web3.Keypair.generate()
    const topicTitle = "Lorem ipsum dolor sit amet, conse"
    const topicContent = "This is a topic content"

    await airdrop(provider.connection, user.publicKey)

    try {
      const tx = await program.methods
      .createTopic(topicTitle, topicContent)
      .accounts({
        topicOwner: user.publicKey,
        topicAccount: topicAccount.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user, topicAccount])
      .rpc({skipPreflight: true})

      assert.fail("The instruction operation must be failed")
    } catch(_error) {
      assert.isNotNull(_error)
    }
  });

  it("when create_topic returns failed because of topic content too long!", async () => {
    const user = anchor.web3.Keypair.generate()
    const topicAccount = anchor.web3.Keypair.generate()
    const topicTitle = "This is a topic title"
    const topicContent = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qua"

    await airdrop(provider.connection, user.publicKey)

    try {
      const tx = await program.methods
      .createTopic(topicTitle, topicContent)
      .accounts({
        topicOwner: user.publicKey,
        topicAccount: topicAccount.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user, topicAccount])
      .rpc({skipPreflight: true})

      assert.fail("The instruction operation must be failed")
    } catch(_error) {
      assert.isNotNull(_error)
    }
  });
});

async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}