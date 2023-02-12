import { GameProvider } from "@/context/GameContext";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";

const colors = {
  ...chakraTheme.colors,
  text: {
    dark: "#07080E",
    black: "#00000099",
    light: "#757575",
  },
  brand: {
    main: "#4D31FF",
    warning: "#FEF8E7",
    danger: "#E64A19",
    border: "#E0E0E0",
    bg: "#FAFAFA",
  },
};
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  ...chakraTheme,
  config,
  colors,
});

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <GameProvider>
        <Component {...pageProps} />
      </GameProvider>
    </ChakraProvider>
  );
}
