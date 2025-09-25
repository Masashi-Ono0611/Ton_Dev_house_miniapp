"use client";
import React from "react";
import { TonConnectUIProvider, TonConnectButton, THEME } from "@tonconnect/ui-react";
import { Box, Flex } from "@chakra-ui/react";

function getManifestUrl() {
  if (typeof window === "undefined") return "/tonconnect-manifest.json";
  return `${window.location.origin}/tonconnect-manifest.json`;
}

export function TonProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={getManifestUrl()} uiPreferences={{ theme: THEME.DARK }}>
      <Flex as="header" px={4} py={3} borderBottom="1px solid" borderColor="gray.200" align="center" justify="flex-end">
        <TonConnectButton />
      </Flex>
      <Box as="main">{children}</Box>
    </TonConnectUIProvider>
  );
}
