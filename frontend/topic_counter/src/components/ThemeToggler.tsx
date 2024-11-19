import { color, IconButton, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ThemeToggler = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      textColor="white"
      aria-label={""}
      onClick={toggleColorMode}
      background={colorMode === "light" ? "orange.300" : "teal.400"}
      size="lg"
    />
  );
};

export default ThemeToggler;
