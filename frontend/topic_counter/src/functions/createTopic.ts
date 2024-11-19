import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export async function createTopic(
  program: anchor.Program,
  topicOwnerPublicKey: PublicKey,
  topicTitle: string,
  topicContent: string
): Promise<string> {
  // Derive the PDA for the topic storage account
  const [topicStoragePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("topic_storage")],
    program.programId
  );

  // Derive the PDA for the topic account
  const [topicPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("topic"),
      Buffer.from(topicTitle),
      topicOwnerPublicKey.toBuffer(),
    ],
    program.programId
  );

  // Call the program method
  const tx = await program.methods
    .createTopic(topicTitle, topicContent)
    .accounts({
      topicOwner: topicOwnerPublicKey,
      topicAccount: topicPda,
      topicStorage: topicStoragePda,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  return tx; // Return the transaction signature
}
