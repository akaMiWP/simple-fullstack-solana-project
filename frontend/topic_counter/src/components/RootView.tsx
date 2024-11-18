import React, { useState } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
  Divider,
  List,
  ListItem,
  Flex,
  Container,
} from "@chakra-ui/react";
import WalletButton from "./WalletButton";

const RootView = () => {
  // State for topics
  const [topics, setTopics] = useState([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");

  // State for total topics
  const totalTopics = topics.length;

  // Handle new topic submission
  const handleSend = () => {
    if (topicTitle.trim() && topicContent.trim()) {
      setTopics([...topics, { title: topicTitle, content: topicContent }]);
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
                <Button colorScheme="teal" onClick={handleSend}>
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
