import { beginCell, toNano } from "@ton/core";
import { VOTE_CONTRACT_ADDRESS } from "./constants";

export type VoteOption = "yes" | "no";

export function buildVotePayload(queryId: number, option: VoteOption): string {
  // SimpleDao RecordVote: opcode(32) = 0xF4A2B1C9, queryId(32), vote(bool)
  const isYes = option === "yes";
  const cell = beginCell()
    .storeUint(0xF4A2B1C9, 32)
    .storeUint(queryId, 32)
    .storeBit(isYes)
    .endCell();
  return cell.toBoc().toString("base64");
}

export function buildVoteMessage(queryId: number, option: VoteOption) {
  return {
    address: VOTE_CONTRACT_ADDRESS,
    amount: toNano("0.05").toString(), // adjust if your contract requires a specific amount
    payload: buildVotePayload(queryId, option),
  };
}
