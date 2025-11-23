# TON Dev HOUSE Mini App (Next.js + Chakra UI)

## Overview
This is a minimal Telegram Mini App (TMA) built with Next.js (App Router), React, TypeScript, and Chakra UI.
It integrates TonConnect for wallet connections and interacts with a Simple DAO smart contract on the TON testnet to:
- Send votes (YES / NO)
- Display current vote counts
- Reset votes (admin operation)

The app is configured to use Tonviewer for the testnet and fetch on-chain state via TonCenter’s testnet endpoint.

## Features
- Voting UI with TonConnect wallet flow
- Real-time vote counts fetched from testnet
- Simple horizontal stacked bar chart for YES/NO distribution
- Admin-only "Reset Votes" transaction
- Telegram Mini App ready (WebView embedding + init flow)
- Chakra UI design with clean defaults

## Tech Stack
- Next.js 14 (App Router)
- React 18, TypeScript 5
- Chakra UI 2
- @tonconnect/ui-react 2.x
- @ton/ton 15.x, @ton/core
- Tonviewer (testnet) links

## Project Structure
- `src/app/layout.tsx`: Root layout, wraps Chakra Provider, TelegramAppProvider, and TonConnect Provider
- `src/app/page.tsx`: Home page (minimal navigation to voting)
- `src/app/vote/page.tsx`: Voting page (vote, view counts, reset)
- `src/app/_components/ChakraProviders.tsx`: Chakra UI theme/provider
- `src/app/_components/TonConnectProvider.tsx`: TonConnect UI provider + button
- `src/app/_components/TelegramAppProvider.tsx`: Telegram WebApp init and dev mock
- `src/lib/ton/constants.ts`: Contract address and topic text
- `src/lib/ton/vote.ts`: Vote/reset payload builders
- `src/lib/ton/dao.ts`: Fetch votes from contract via TonCenter

## Getting Started
1) Install dependencies
- npm: `npm install`
- pnpm: `pnpm install`
- yarn: `yarn`

2) Development
- `npm run dev` (port 3000)
- Open `http://localhost:3000`

3) Production-like
- `npm run build`
- `npm start` (port 3000)

## Environment Variables (optional)
- `NEXT_PUBLIC_TONCENTER_API_URL` (default: `https://testnet.toncenter.com/api/v2/jsonRPC`)
- `NEXT_PUBLIC_TONCENTER_API_KEY` (recommended for higher rate limits)
- Consider adding an `.env.example` and avoid committing secrets.

## Telegram Mini App
- The app is designed to run inside Telegram WebView.
- In development, `TelegramAppProvider` provides a lightweight mock for local browser testing.
- For real TMA testing:
  1) Build and start the app
     ```bash
     pnpm run build
     pnpm start
     ```
  2) Expose via ngrok
     ```bash
     ngrok http 3000
     ```
  3) Register the ngrok URL as the WebApp URL in BotFather
  4) Open the bot in Telegram and launch the Mini App

## TonConnect
- Integrated via `TonConnectUIProvider` in `src/app/_components/TonConnectProvider.tsx`
- A `TonConnectButton` is available in the header for wallet connect and transactions

## Voting Page
- Contract: `VOTE_CONTRACT_ADDRESS` in `src/lib/ton/constants.ts`
- Topic text: `VOTE_TOPIC` in `src/lib/ton/constants.ts`
- Vote sending uses `buildVoteMessage(queryId, option)`
- Current votes fetched by `fetchVotes(address)` from `src/lib/ton/dao.ts`
- Chart: simple horizontal stacked bar (YES=green / NO=red) with percentage labels

## Admin: Reset Votes
- "Reset Votes" button sends an admin-only reset transaction
- Opcode: `0xD4E7B328`, amount: `toNano("0.05")`
- Built via `buildResetMessage(queryId)` in `src/lib/ton/vote.ts`
- UI triggers a confirmation and refreshes counts after success
- Admin authorization is enforced by the smart contract

## Testnet Explorer
- Contract link base: `https://testnet.tonviewer.com/`

## Security Headers
- `next.config.mjs` sets:
  - `Content-Security-Policy` with `frame-ancestors` for Telegram WebView
  - `X-Frame-Options: ALLOW-FROM https://web.telegram.org`
- Extend `connect-src` for external APIs or TON RPC endpoints as needed.

## Scripts
- `dev`: Next.js dev server on port 3000
- `build`: Production build
- `start`: Start production server on port 3000
- `lint`: ESLint
- `type-check`: TypeScript type check
