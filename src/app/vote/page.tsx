"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Box, Button, Container, Heading, Stack, Text, HStack, Alert, AlertIcon, Link as CLink } from "@chakra-ui/react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { buildVoteMessage, VoteOption } from "@/lib/ton/vote";
import { VOTE_CONTRACT_ADDRESS, VOTE_TOPIC } from "@/lib/ton/constants";

export default function VotePage() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const connected = !!wallet;

  const contractLink = useMemo(() => {
    return `https://testnet.tonviewer.com/${VOTE_CONTRACT_ADDRESS}`;
  }, []);

  const sendVote = useCallback(
    async (option: VoteOption) => {
      if (!connected) return;
      setSending(true);
      setResult(null);
      try {
        const queryId = Math.floor(Date.now() / 1000);
        const tx = {
          validUntil: Math.floor(Date.now() / 1000) + 600,
          messages: [buildVoteMessage(queryId, option)],
        };
        await tonConnectUI.sendTransaction(tx);
        setResult(`Your ${option.toUpperCase()} vote was sent (queryId: ${queryId}).`);
      } catch (e: any) {
        setResult(e?.message ?? "Failed to send the transaction");
      } finally {
        setSending(false);
      }
    },
    [connected, tonConnectUI]
  );

  return (
    <Container maxW="lg" py={10}>
      <Stack spacing={6}>
        <Heading size="lg">Voting</Heading>
        <Text color="gray.600">Topic: {VOTE_TOPIC}</Text>
        <Text color="gray.600">Contract: <CLink href={contractLink} isExternal color="teal.500">{VOTE_CONTRACT_ADDRESS}</CLink></Text>

        {!connected && (
          <Alert status="info">
            <AlertIcon />
            Connect your wallet to vote.
          </Alert>
        )}

        <HStack>
          <Button colorScheme="green" onClick={() => sendVote("yes")} isDisabled={!connected || sending}>
            Vote YES
          </Button>
          <Button colorScheme="red" onClick={() => sendVote("no")} isDisabled={!connected || sending}>
            Vote NO
          </Button>
        </HStack>

        {result && (
          <Box>
            <Text>{result}</Text>
            <Text>
              You can verify on <CLink href={contractLink} isExternal color="teal.500">Tonviewer</CLink>.
            </Text>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
