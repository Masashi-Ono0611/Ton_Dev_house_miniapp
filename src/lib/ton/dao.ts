import { Address } from "@ton/core";
import { TonClient } from "@ton/ton";

const DEFAULT_TONCENTER_TESTNET = "https://testnet.toncenter.com/api/v2/jsonRPC";

function createClient() {
  const endpoint = process.env.NEXT_PUBLIC_TONCENTER_API_URL || DEFAULT_TONCENTER_TESTNET;
  const apiKey = process.env.NEXT_PUBLIC_TONCENTER_API_KEY;
  const client = new TonClient({ endpoint, apiKey });
  return client;
}

function readThreeNumbersFromStack(stack: any): { yes: bigint; no: bigint; total: bigint } {
  // Try to be resilient to different tuple reader shapes
  const values: bigint[] = [];
  const reader: any = stack?.stack || stack?.result || stack;
  const take = () => {
    if (!reader) return 0n;
    if (typeof reader.readBigNumber === "function") return BigInt(reader.readBigNumber());
    if (typeof reader.readNumber === "function") return BigInt(reader.readNumber());
    if (typeof reader.pop === "function") {
      const v = reader.pop();
      if (typeof v === "bigint") return v;
      if (v && typeof v.value !== "undefined") return BigInt(v.value);
      if (typeof v === "number") return BigInt(v);
    }
    return 0n;
  };
  values.push(take());
  values.push(take());
  values.push(take());
  return { yes: values[0], no: values[1], total: values[2] };
}

export async function fetchVotes(address: string): Promise<{ yes: number; no: number; total: number }> {
  const client = createClient();
  const addr = Address.parse(address);
  const candidates = ["get_votes", "getVotes", "votes", "get_current_votes"];
  for (const method of candidates) {
    try {
      const res: any = await client.runMethod(addr, method);
      const { yes, no, total } = readThreeNumbersFromStack(res);
      return { yes: Number(yes), no: Number(no), total: Number(total) };
    } catch (e) {
      // try next
    }
  }
  throw new Error("Failed to fetch votes from contract (no compatible get method).");
}
