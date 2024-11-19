import { useState } from "react";
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
} from "@chakra-ui/react";
import WalletButton from "./WalletButton";
import { useFetchTopicStorageData } from "../effects/useFetchTopicStorageData";
import { createTopic } from "../functions/createTopic";
import { program } from "../anchor/setup";
import { PublicKey } from "@solana/web3.js";
import { Idl } from "@coral-xyz/anchor";
import anchor from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";

const RootView = () => {
  // State for topics
  const [topics, setTopics] = useState([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");

  // State for total topics
  // const totalTopics = topics.length;
  const totalTopics = useFetchTopicStorageData();

  const { publicKey, connected } = useWallet();

  // Handle new topic submission
  const handleSend = async () => {
    if (topicTitle.trim() && topicContent.trim() && publicKey) {
      // setTopics([...topics, { title: topicTitle, content: topicContent }]);

      await createTopic(
        program as unknown as anchor.Program<Idl>,
        publicKey,
        topicTitle,
        topicContent
      );

      setTopicTitle("");
      setTopicContent("");
    }
  };

  return (
    <Box height="100vh">
      <Box position="fixed" right="1rem" paddingTop={4}>
        <WalletButton />
      </Box>
      <Flex
        paddingTop={16}
        width="100vw" // Ensures full viewport width
        height="100%" // Ensures height is dynamic based on content
        align="flex-start" // Aligns items to the top of the container (default for `align="center"`)
        justifyContent="center" // Centers the child horizontally
      >
        <Box>
          {/* Headline */}
          <Heading as="h1" textAlign="center" mb={4}>
            This is a Simple Topic Counter web application
          </Heading>

          {/* Subheadline */}
          <Text as="i" textAlign="center" display="block" mb={8}>
            this site is an attempt to connect a simple web application with
            deployed Solana program on devnet
          </Text>

          <Divider my={6} />

          {/* Solana Program Section */}
          <VStack spacing={6} align="stretch">
            {/* Conclusion */}
            <Text fontSize="xl" fontWeight="bold">
              How many topics are there right now: {totalTopics}
            </Text>

            {/* Input Section */}
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
                    <Text>Content: {topic.content}</Text>
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

export default RootView;
