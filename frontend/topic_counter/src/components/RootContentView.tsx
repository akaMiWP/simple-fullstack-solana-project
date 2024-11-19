import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  Input,
  Textarea,
  Button,
  Divider,
  List,
  ListItem,
  Flex,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { useFetchTopicStorageData } from "../effects/useFetchTopicStorageData";
import { createTopic } from "../functions/createTopic";
import { program } from "../anchor/setup";
import { Idl } from "@coral-xyz/anchor";
import anchor from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Topic } from "../interfaces/Topic";
import { fetchTopics } from "../functions/fetchTopics";
import { PublicKey } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey(
  "8fwUnvsRypGyT17uHcp3gE6mCVT46FXqDhR1DDy4ZNee"
);

const RootContentView = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");

  const totalTopics = useFetchTopicStorageData();

  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const handleSend = async () => {
    if (topicTitle.trim() && topicContent.trim() && publicKey) {
      let tx = await createTopic(
        program as unknown as anchor.Program<Idl>,
        publicKey,
        topicTitle,
        topicContent,
        sendTransaction,
        connection
      );
      console.log("Transaction Signature", tx);

      setTopicTitle("");
      setTopicContent("");
      setTopics([
        ...topics,
        {
          author: publicKey.toBase58(),
          title: topicTitle,
          content: topicContent,
        },
      ]);
    }
  };

  useEffect(() => {
    const fetchAndSetTopics = async () => {
      try {
        const fetchedTopics = await fetchTopics(PROGRAM_ID, connection);
        setTopics(fetchedTopics); // Update the state with fetched topics
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchAndSetTopics();
  }, []);

  return (
    <Box height="100vh">
      <Box position="fixed" right="1rem" paddingTop={4}>
        <WalletMultiButton />
      </Box>
      <Flex
        paddingTop={16}
        paddingX={4}
        width="100vw"
        height="100%"
        align="flex-start"
        justifyContent="center"
      >
        <Box>
          <Heading as="h1" textAlign="center" mb={4}>
            This is a Simple Topic Counter web application
          </Heading>

          <Text as="i" textAlign="center" display="block" mb={8}>
            this site is an attempt to connect a simple web application with
            deployed Solana program on devnet
          </Text>

          <Divider my={6} />

          <VStack spacing={6} align="stretch">
            <Text fontSize="xl" fontWeight="bold">
              How many topics are there right now?: {totalTopics}
            </Text>

            <Box
              border="1px solid"
              borderColor="gray.200"
              p={4}
              borderRadius="md"
            >
              <VStack spacing={4} align="stretch">
                <Input
                  placeholder="Topic title"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Topic content"
                  value={topicContent}
                  onChange={(e) => setTopicContent(e.target.value)}
                />
                <Button
                  onClick={handleSend}
                  isDisabled={!connected}
                  background={connected ? "teal" : "gray.300"}
                >
                  Send
                </Button>
              </VStack>
            </Box>

            <Divider />

            {/* Topics Section */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={4}>
                Topics:
              </Text>
              <List spacing={4}>
                {topics.map((topic, index) => (
                  <ListItem
                    key={index}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    pb={2}
                    mb={2}
                  >
                    <Text fontWeight="bold">Title: {topic.title}</Text>
                    <HStack>
                      <Text>Content: {topic.content}</Text>
                      <Spacer />
                      <Text>
                        Author:{" "}
                        {`${topic.author.slice(0, 5)}...${topic.author.slice(
                          -5
                        )}`}
                      </Text>
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default RootContentView;
