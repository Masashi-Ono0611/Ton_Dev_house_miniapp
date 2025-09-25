"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Box, Button, Container, Heading, Stack, Text, HStack, Alert, AlertIcon, Link as CLink, Spinner } from "@chakra-ui/react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { buildVoteMessage, VoteOption } from "@/lib/ton/vote";
import { VOTE_CONTRACT_ADDRESS, VOTE_TOPIC } from "@/lib/ton/constants";
import { fetchVotes } from "@/lib/ton/dao";
import { useEffect } from "react";

export default function VotePage() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const connected = !!wallet;
  const [votes, setVotes] = useState<{ yes: number; no: number; total: number } | null>(null);
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [votesError, setVotesError] = useState<string | null>(null);

  const contractLink = useMemo(() => {
    return `https://testnet.tonviewer.com/${VOTE_CONTRACT_ADDRESS}`;
  }, []);

  const loadVotes = useCallback(async () => {
    setLoadingVotes(true);
    setVotesError(null);
    try {
      const v = await fetchVotes(VOTE_CONTRACT_ADDRESS);
      setVotes(v);
    } catch (e: any) {
      setVotesError(e?.message ?? "Failed to load votes");
    } finally {
      setLoadingVotes(false);
    }
  }, []);

  useEffect(() => {
    // initial load
    loadVotes();
  }, [loadVotes]);

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
        // Re-fetch votes after a short delay to allow state update on-chain/indexer
        setTimeout(() => {
          loadVotes();
        }, 4000);
      } catch (e: any) {
        setResult(e?.message ?? "Failed to send the transaction");
      } finally {
        setSending(false);
      }
    },
    [connected, tonConnectUI, loadVotes]
  );

  return (
    <Container maxW="lg" py={10}>
      <Stack spacing={6}>
        <Heading size="lg">Voting</Heading>
        <Text color="gray.600">Topic: {VOTE_TOPIC}</Text>
        <Text color="gray.600">Contract: <CLink href={contractLink} isExternal color="teal.500">{VOTE_CONTRACT_ADDRESS}</CLink></Text>

        <Box borderWidth="1px" borderRadius="md" p={4}>
          <HStack justify="space-between" mb={2}>
            <Heading size="sm">Current Votes (testnet)</Heading>
            <Button size="sm" onClick={loadVotes} isLoading={loadingVotes} loadingText="Refreshing">
              Refresh
            </Button>
          </HStack>
          {votesError && (
            <Alert status="error" mb={2}>
              <AlertIcon />
              {votesError}
            </Alert>
          )}
          {loadingVotes && !votes ? (
            <HStack>
              <Spinner size="sm" />
              <Text fontSize="sm">Loading votes...</Text>
            </HStack>
          ) : (
            <HStack>
              <Text fontSize="sm">YES: {votes?.yes ?? "-"}</Text>
              <Text fontSize="sm">NO: {votes?.no ?? "-"}</Text>
              <Text fontSize="sm">TOTAL: {votes?.total ?? "-"}</Text>
            </HStack>
          )}
        </Box>

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
