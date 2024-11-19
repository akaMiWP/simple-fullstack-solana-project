import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { SendTransactionOptions } from "@solana/wallet-adapter-base";

export async function createTopic(
  program: anchor.Program,
  topicOwnerPublicKey: PublicKey,
  topicTitle: string,
  topicContent: string,
  sendTransaction: (
    transaction: anchor.web3.Transaction | anchor.web3.VersionedTransaction,
    connection: anchor.web3.Connection,
    options?: SendTransactionOptions
  ) => Promise<anchor.web3.TransactionSignature>,
  connection: anchor.web3.Connection
): Promise<string> {
  const [topicStoragePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("topic_storage")],
    program.programId
  );
  const [topicPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("topic"),
      Buffer.from(topicTitle),
      topicOwnerPublicKey.toBuffer(),
    ],
    program.programId
  );
  console.log("TopicStoragePda:", topicStoragePda);
  console.log("TopicPda:", topicPda);
  const transaction = await program.methods
    .createTopic(topicTitle, topicContent)
    .accounts({
      topicOwner: topicOwnerPublicKey,
      topicAccount: topicPda,
      topicStorage: topicStoragePda,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .transaction();

  const transactionSignature = await sendTransaction(transaction, connection);
  return transactionSignature;
}
