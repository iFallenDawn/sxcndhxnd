"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// Custom theme with Roboto font
const theme = extendTheme({
  fonts: {
    heading: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
  },
});

export function ChakraUIProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
