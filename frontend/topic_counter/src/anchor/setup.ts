import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { IDL, TopicCounter } from "./idl";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = new Program<TopicCounter>(IDL, {
  connection,
});

export const [topicStoragePda] = PublicKey.findProgramAddressSync(
  [Buffer.from("topic_storage")],
  program.programId
);

export type TopicStorageData = IdlAccounts<TopicCounter>["TopicStorage"];
