import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import RootView from "./components/RootView";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({ config });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <RootView />
    </ChakraProvider>
  );
}

export default App;
