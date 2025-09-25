"use client";
import React from "react";
import { ChakraProvider, extendTheme, ThemeConfig, ColorModeScript } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme({ config });

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

export function ThemeScript() {
  return <ColorModeScript initialColorMode={config.initialColorMode} />;
}
