import { useEffect, useMemo, useRef, useState } from "react";
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
  useColorMode,
  AlertDialog,
  useDisclosure,
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
import ThemeToggler from "./ThemeToggler";
import LoadingDialog from "./LoadingDialog";

const PROGRAM_ID = new PublicKey(
  "8fwUnvsRypGyT17uHcp3gE6mCVT46FXqDhR1DDy4ZNee"
);

const RootContentView = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");
  const isTopicTitleValid: boolean = useMemo(() => {
    return topicTitle.length <= 32;
  }, [topicTitle]);
  const isTopicContentValid: boolean = useMemo(() => {
    return topicContent.length <= 200;
  }, [topicContent]);

  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { colorMode } = useColorMode();

  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const totalTopics = useFetchTopicStorageData(isConfirmed);

  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isButtonEnabled: boolean = useMemo(() => {
    return (
      connected &&
      topicTitle != "" &&
      topicContent != "" &&
      isTopicTitleValid &&
      isTopicContentValid
    );
  }, [connected, topicTitle, topicContent]);

  const handleSend = async () => {
    if (topicTitle.trim() && topicContent.trim() && publicKey) {
      let tx = await createTopic(
        program as unknown as anchor.Program<Idl>,
        publicKey,
        topicTitle,
        topicContent,
        sendTransaction,
        connection,
        onOpen,
        setTransactionSignature,
        setIsConfirmed
      );
      console.log("Transaction Signature", tx);

      setTopicTitle("");
      setTopicContent("");
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
  }, [isConfirmed]);

  return (
    <Box>
      <HStack position="fixed" right="1rem" paddingTop={4}>
        <Spacer />
        <ThemeToggler />
        <Box>
          <WalletMultiButton />
        </Box>
      </HStack>
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
              How many topics are there right now?:{" "}
              {totalTopics?.toString() ?? "0"}
            </Text>

            <Box
              border="1px solid"
              borderColor="gray.200"
              p={4}
              borderRadius="md"
            >
              <VStack spacing={4} align="stretch">
                <VStack spacing={2} align="stretch">
                  <Input
                    placeholder="Topic title"
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                  />
                  {!isTopicTitleValid && (
                    <Text as="sub" color="red">
                      Title must not be longer than 32 characters
                    </Text>
                  )}
                </VStack>
                <VStack spacing={2} align="stretch">
                  <Textarea
                    placeholder="Topic content"
                    value={topicContent}
                    onChange={(e) => setTopicContent(e.target.value)}
                  />
                  {!isTopicContentValid && (
                    <Text as="sub" color="red">
                      Content must not be longer than 200 characters
                    </Text>
                  )}
                </VStack>
                <Button
                  textColor="white"
                  onClick={handleSend}
                  isDisabled={!isButtonEnabled}
                  background={
                    isButtonEnabled
                      ? colorMode === "light"
                        ? "orange.300"
                        : "teal.400"
                      : "gray.300"
                  }
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
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <LoadingDialog
          transactionSignature={transactionSignature}
          isConfirmed={isConfirmed}
          onClose={onClose}
        />
      </AlertDialog>
    </Box>
  );
};

export default RootContentView;
