"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Box, Button, Container, Heading, Stack, Text, HStack, Alert, AlertIcon, Link as CLink, Spinner } from "@chakra-ui/react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { buildVoteMessage, buildResetMessage, VoteOption } from "@/lib/ton/vote";
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

  const { yesCount, noCount, totalCount, yesPct, noPct } = useMemo(() => {
    const yes = votes?.yes ?? 0;
    const no = votes?.no ?? 0;
    const total = votes?.total ?? yes + no; // fallback if contract doesn't return total
    const safeTotal = total > 0 ? total : yes + no;
    const base = safeTotal > 0 ? safeTotal : 0;
    const yp = base > 0 ? Math.round((yes / base) * 100) : 0;
    const np = base > 0 ? Math.round((no / base) * 100) : 0;
    // ensure sum doesn't exceed 100 due to rounding
    const adjust = yp + np > 100 ? (yp + np - 100) : 0;
    return {
      yesCount: yes,
      noCount: no,
      totalCount: base,
      yesPct: yp - adjust,
      noPct: np,
    };
  }, [votes]);

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

  const sendReset = useCallback(async () => {
    if (!connected) return;
    const confirm = typeof window !== "undefined" ? window.confirm("Reset all votes to 0? This action cannot be undone.") : true;
    if (!confirm) return;
    setSending(true);
    setResult(null);
    try {
      const queryId = Math.floor(Date.now() / 1000);
      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [buildResetMessage(queryId)],
      };
      await tonConnectUI.sendTransaction(tx);
      setResult(`Reset sent (queryId: ${queryId}).`);
      setTimeout(() => {
        loadVotes();
      }, 4000);
    } catch (e: any) {
      setResult(e?.message ?? "Failed to send the transaction");
    } finally {
      setSending(false);
    }
  }, [connected, tonConnectUI, loadVotes]);

  return (
    <Container maxW="lg" py={10}>
      <Stack spacing={6}>
        <Heading size="lg">Voting</Heading>
        <Text color="gray.600">Topic: {VOTE_TOPIC}</Text>
        <Text color="gray.600">Contract: <CLink href={contractLink} isExternal color="teal.500">{VOTE_CONTRACT_ADDRESS}</CLink></Text>

        <Box borderWidth="1px" borderRadius="md" p={4}>
          <HStack justify="space-between" mb={2}>
            <Heading size="sm">Current Votes</Heading>
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
            <Stack spacing={3}>
              <HStack spacing={4}>
                <HStack spacing={2}>
                  <Box w={3} h={3} bg="green.400" borderRadius="sm" />
                  <Text fontSize="sm">YES: {yesCount} ({yesPct}%)</Text>
                </HStack>
                <HStack spacing={2}>
                  <Box w={3} h={3} bg="red.400" borderRadius="sm" />
                  <Text fontSize="sm">NO: {noCount} ({noPct}%)</Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">TOTAL: {totalCount}</Text>
              </HStack>

              <Box aria-label="Votes distribution" role="img">
                <Box
                  position="relative"
                  w="100%"
                  h={4}
                  bg="gray.100"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <HStack w="100%" h="100%" spacing={0}>
                    <Box w={`${yesPct}%`} h="100%" bg="green.400" />
                    <Box w={`${noPct}%`} h="100%" bg="red.400" />
                  </HStack>
                </Box>
              </Box>
            </Stack>
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

        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Heading size="sm" color="red.600" mb={2}>Admin</Heading>
          <HStack>
            <Button colorScheme="red" variant="outline" onClick={sendReset} isDisabled={!connected || sending}>
              Reset Votes
            </Button>
            <Text fontSize="xs" color="red.600">Reset all counters to 0 (testnet).</Text>
          </HStack>
        </Box>

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
