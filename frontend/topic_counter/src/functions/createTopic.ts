import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
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
  connection: anchor.web3.Connection,
  onClick: () => void,
  setTransactionSignature: (signature: string) => void,
  setIsConfirmed: (isConfirmed: boolean) => void
): Promise<string> {
  const [topicStoragePda] = PublicKey.findProgramAddressSync(
    [new TextEncoder().encode("topic_storage")],
    program.programId
  );
  const [topicPda] = PublicKey.findProgramAddressSync(
    [
      new TextEncoder().encode("topic"),
      new TextEncoder().encode(topicTitle),
      topicOwnerPublicKey.toBuffer(),
    ],
    program.programId
  );

  const transaction = await program.methods
    .createTopic(topicTitle, topicContent)
    .accounts({
      topicOwner: topicOwnerPublicKey,
      topicAccount: topicPda,
      topicStorage: topicStoragePda,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .transaction();

  onClick();
  const transactionSignature = await sendTransaction(transaction, connection);
  setTransactionSignature(transactionSignature);

  const { value } = await connection.confirmTransaction(
    transactionSignature,
    "confirmed"
  );

  {
    value && setIsConfirmed(true);
  }

  return transactionSignature;
}
