import { Connection, PublicKey } from "@solana/web3.js";
import { Topic } from "../interfaces/Topic";
import * as borsh from "@project-serum/borsh";

const topicSchema = borsh.struct([
  borsh.array(borsh.u8(), 8, "discriminator"), // 8-byte Anchor discriminator
  borsh.publicKey("topic_author"), // 32 bytes
  borsh.array(borsh.u8(), 32, "title"), // 32 bytes
  borsh.array(borsh.u8(), 200, "content"), // 200 bytes
  borsh.u8("bump"), // 1 byte
]);

export async function fetchTopics(
  programId: PublicKey,
  connection: Connection
): Promise<Topic[]> {
  try {
    const accounts = await connection.getProgramAccounts(programId);

    const topics: Topic[] = accounts
      .map(({ account }) => {
        try {
          const decoded = topicSchema.decode(account.data);

          const author = new PublicKey(decoded.topic_author).toBase58();

          const title = new TextDecoder()
            .decode(new Uint8Array(decoded.title))
            .replace(/\0/g, "");

          const content = new TextDecoder()
            .decode(new Uint8Array(decoded.content))
            .replace(/\0/g, "");

          return {
            author: author,
            title: title,
            content: content,
          };
        } catch {
          return null;
        }
      })
      .filter((topic) => topic !== null);
    return topics;
  } catch (error) {
    console.error("Error fetching PDAs:", error);
    return [];
  }
}
