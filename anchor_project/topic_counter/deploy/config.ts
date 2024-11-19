import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

const main = async () => {
  // Configure the provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Load the program
  const program = anchor.workspace.TopicCounter;

  // Derive the PDA for the topic storage account
  const [topicStoragePda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("topic_storage")],
    program.programId
  );

  console.log("PDA:", topicStoragePda.toBase58(), "Bump:", bump);
  console.log("Program ID:", program.programId.toBase58());
  console.log("Topic Storage PDA:", topicStoragePda.toBase58());

  try {
    // Call the deployProgram instruction to initialize the topic_storage account
    const tx = await program.methods
      .deployProgram()
      .rpc({ commitment: "confirmed" });

    console.log("Transaction successful. Signature:", tx);

    // Fetch and verify the initialized topic_storage account
    const topicStorageAccount = await program.account.topicStorage.fetch(topicStoragePda);
    console.log("Initialized Topic Storage Account:", topicStorageAccount);
    console.log("Total Topics:", topicStorageAccount.totalTopics.toNumber());
  } catch (err) {
    console.error("Failed to initialize topic storage:", err);
  }
};

main().catch((err) => {
  console.error("Error running script:", err);
  process.exit(1);
});