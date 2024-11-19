import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import WalletButton from "./components/WalletButton";

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};
const theme = extendTheme({ config });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <WalletButton />
    </ChakraProvider>
  );
}

export default App;
