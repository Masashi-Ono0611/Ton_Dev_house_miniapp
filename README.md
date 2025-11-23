# Simple Next.js App (App Router)

This project is a minimal starter using **Next.js 16.0.x**, **React 19.x**, **TypeScript 5.x**, and **Chakra UI 3.x**.

## Setup

### Install Dependencies
You can use your preferred package manager (npm, pnpm, or yarn).
*Note: `package-lock.json` is provided for npm.*

- **npm**: `npm install`
- **pnpm**: `pnpm install`
- **yarn**: `yarn`

### Run Development Server
Runs on port 3000.

- **npm**: `npm run dev`
- **pnpm**: `pnpm run dev`
- **yarn**: `yarn dev`

### Build and Start
- `npm run build` / `npm start`
- `pnpm run build` / `pnpm start`
- `yarn build` / `yarn start`

## Project Structure

- `src/app/`: App Router structure
  - `layout.tsx`: Root layout (Chakra UI Provider applied)
  - `page.tsx`: Top page
- `src/app/_components/ChakraProviders.tsx`: Chakra UI Provider settings (v3 system)
- `tsconfig.json`: TypeScript settings
- `next.config.mjs`: Next.js settings

## Notes

- Comments and logs in the code are in English.
- `.env` is not created by default. If needed, please create one and add `.env.example`.

## Telegram Mini App Support

- **Production**: Only works inside Telegram WebView. Direct browser access is not supported (shows a warning on the top page).
- **Development** (`NODE_ENV=development`): `TelegramAppProvider` enables a mock, allowing minimal operation checks in a local browser.

### 1. Key File Structure

- `src/app/_components/TelegramAppProvider.tsx`
  - Detects `window.Telegram.WebApp` and executes `ready()/expand()`.
  - Provides mock `initData` only during development.
- `src/app/_components/TonConnectProvider.tsx`
  - Provides `TonConnectUIProvider` and `TonConnectButton`.
- `src/app/layout.tsx`
  - Nests `TonProvider` inside `TelegramAppProvider`.
- `next.config.mjs`
  - Sets `Content-Security-Policy` / `X-Frame-Options` to allow embedding in Telegram WebView.

### 2. BotFather Setup (Production/Verification)

- Main BotFather commands:
  - `/newbot`: Create a Bot (get token)
  - `/setwebapp`: Register Mini App URL (or `/setdomain`)
  - `/setmenu`: Place Web App in the menu (optional)
- Specify WebApp URL as `https://<your-domain>/`

### 3. Verification with ngrok

1. **Build for production**
   ```bash
   npm run build
   npm start
   ```

2. **Expose port 3000 with ngrok** (in a separate terminal)
   ```bash
   ngrok http 3000
   ```

3. **Set WebApp URL**
   Set the displayed `https://<your-ngrok>.ngrok-free.app` as the WebApp URL in BotFather.

4. **Launch**
   Open the Bot in Telegram client and start the Mini App.

*Note: The dev server (`npm run dev`) is for hot reloading, and WebView behavior may differ. `start` is recommended for production-equivalent verification.*

### 4. Environment Variables & Settings

- Add `WEB_URL` etc. to `.env` if necessary.
- Do not overwrite `.env` directly; maintain `.env.example` for team operation.

### 5. Security Headers

- Configured in `next.config.mjs`:
  - `Content-Security-Policy`: Allows Telegram domains in `frame-ancestors`, allows minimal `script/style/img/connect`.
  - `X-Frame-Options: ALLOW-FROM https://web.telegram.org`
- Add TON related API / RPC to `connect-src` as needed.

### 6. Verification Points

- Check `src/app/page.tsx` for:
  - `isTMA` (Check if inside Telegram)
  - `initData.user.id` / `initData.user.username`
- If user info is displayed inside Telegram, it is working correctly.
