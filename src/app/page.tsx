"use client";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container maxW="lg" py={12}>
      <Stack gap={6}>
        <Heading size="lg">TON Dev HOUSE Mini App</Heading>
        <Text color="gray.500">made by Masa</Text>
        <Box>
          <Link href={{ pathname: "/vote" }}>
            <Button colorScheme="blue">Go to Voting</Button>
          </Link>
        </Box>
      </Stack>
    </Container>
  );
}
