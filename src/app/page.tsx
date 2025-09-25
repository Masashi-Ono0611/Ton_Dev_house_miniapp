"use client";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import Link from "next/link";

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
        <Text color="gray.500">This is a simple starter including an example API route.</Text>
        <Box>
          <Button colorScheme="teal" onClick={checkVersion}>Check /api/version</Button>
          {apiInfo && (
            <Text mt={3} fontFamily="mono">{apiInfo}</Text>
          )}
        </Box>
        <Box>
          <Link href={{ pathname: "/vote" }}>
            <Button colorScheme="blue">Go to Voting</Button>
          </Link>
        </Box>
      </Stack>
    </Container>
  );
}
