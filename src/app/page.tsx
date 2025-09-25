"use client";
import { Alert, AlertIcon, Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useTelegram } from "./_components/TelegramAppProvider";

export default function HomePage() {
  const { isTMA, initData } = useTelegram();
  const isProd = process.env.NODE_ENV === "production";
  return (
    <Container maxW="lg" py={12}>
      <Stack spacing={6}>
        <Heading size="lg">TON Dev HOUSE Mini App</Heading>
        <Text color="gray.500">made by Masa</Text>
        {isProd && !isTMA && (
          <Alert status="warning">
            <AlertIcon />
            このアプリは本番環境ではTelegram内でのみ動作します。Telegramから開いてください。
          </Alert>
        )}
        <Box>
          <Heading size="sm">Telegram Context</Heading>
          <Text fontSize="sm" color="gray.600">isTMA: {String(isTMA)}</Text>
          <Text fontSize="sm" color="gray.600">user.id: {initData?.user?.id ?? "-"}</Text>
          <Text fontSize="sm" color="gray.600">user.username: {initData?.user?.username ?? "-"}</Text>
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
