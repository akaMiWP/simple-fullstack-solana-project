import {
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Spinner,
  useColorMode,
  Text,
} from "@chakra-ui/react";

const LoadingDialog = ({
  transactionSignature,
  isConfirmed,
  onClose,
}: {
  transactionSignature: string | null;
  isConfirmed: boolean;
  onClose: () => void;
}) => {
  const { colorMode } = useColorMode();

  return (
    <>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>
          {isConfirmed ? (
            "Transaction is completed"
          ) : (
            <HStack>
              <Text>
                {transactionSignature
                  ? "Transaction is being submitted"
                  : "Waiting for approval"}
              </Text>
              {transactionSignature && (
                <Spinner
                  color={colorMode === "light" ? "orange.300" : "teal.400"}
                  size="md"
                />
              )}
            </HStack>
          )}
        </AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody marginBottom={transactionSignature ? 0 : 8}>
          {isConfirmed
            ? `Confirmed Transaction: ${transactionSignature}`
            : transactionSignature
            ? `Submitted Transaction: ${transactionSignature}`
            : "Pending Confirmation..."}
        </AlertDialogBody>
        {isConfirmed && (
          <AlertDialogFooter>
            <Button
              textColor="white"
              background={colorMode === "light" ? "orange.300" : "teal.400"}
              onClick={onClose}
              ml={3}
            >
              Ok
            </Button>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </>
  );
};

export default LoadingDialog;
