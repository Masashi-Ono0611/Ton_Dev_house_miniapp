"use client";
import React from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}

export function ThemeScript() {
  // Chakra UI v3 handles color mode differently. 
  // Returning null for now to satisfy the export requirement without breaking build.
  return null;
}
