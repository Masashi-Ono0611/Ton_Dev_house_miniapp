"use client";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function HomePage() {
  const [apiInfo, setApiInfo] = useState<string>("");

  async function checkVersion() {
    try {
      const res = await fetch("/api/version", { cache: "no-store" });
      const json = await res.json();
      setApiInfo(`version: ${json.version} (name: ${json.name}) at ${json.time}`);
    } catch (e) {
      setApiInfo("Failed to fetch /api/version");
    }
  }

  return (
    <Container maxW="lg" py={12}>
      <Stack spacing={6}>
        <Heading size="lg">Next.js + Chakra UI Minimal App</Heading>
        <Text color="gray.500">
          これはシンプルなスターターです。Chakra UIのコンポーネントで構築され、APIルートの例を含みます。
        </Text>
        <Box>
          <Button colorScheme="teal" onClick={checkVersion}>/api/version を確認</Button>
          {apiInfo && (
            <Text mt={3} fontFamily="mono">{apiInfo}</Text>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
