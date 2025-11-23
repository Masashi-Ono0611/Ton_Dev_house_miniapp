# シンプル Next.js アプリ (App Router)

このプロジェクトは Next.js 14.2.x, React 18.x, TypeScript 5.x, Chakra UI 2.8.x を利用した最小構成のスターターです。

## セットアップ

- 依存関係のインストール
  - npm: `npm install`
  - pnpm: `pnpm install`
  - yarn: `yarn`

- 開発サーバーの起動 (ポート3000)
  - npm: `npm run dev`
  - pnpm: `pnpm run dev`
  - yarn: `yarn dev`

- ビルドと起動
  - `npm run build` / `pnpm run build` / `yarn build`
  - `npm start` / `pnpm start` / `yarn start`

## 構成

- `src/app/` App Router 構成
  - `layout.tsx` ルートレイアウト (Chakra UI Provider を適用)
  - `page.tsx` トップページ
- `src/app/_components/ChakraProviders.tsx` Chakra UIのProvider設定
- `tsconfig.json` TypeScript設定 (JSONのimport対応など)
- `next.config.mjs` Next.js設定

## 備考

- コード内のコメント・ログは英語、READMEなどのドキュメントは日本語方針です。
- .env は作成していません。必要になった場合は `.env.example` を追加してください。

## Telegram Mini App 対応

- 本番環境では Telegram WebView 内でのみ動作します。ブラウザ直開きは非対応です（トップページに警告を表示）。
- 開発環境（`NODE_ENV=development`）では、`TelegramAppProvider` がモックを有効化し、ローカルブラウザでも最低限の動作確認が可能です。

### 1. ファイル構成の要点

- `src/app/_components/TelegramAppProvider.tsx`
  - Telegram WebApp の `window.Telegram.WebApp` を検出して `ready()/expand()` を実行
  - 開発時のみモック initData を提供
- `src/app/_components/TonConnectProvider.tsx`
  - `TonConnectUIProvider` と `TonConnectButton` を提供
- `src/app/layout.tsx`
  - `TelegramAppProvider` の内側に `TonProvider` をネスト
- `next.config.mjs`
  - Telegram WebView での埋め込みを許可する `Content-Security-Policy` / `X-Frame-Options`

### 2. BotFather 設定（本番/検証）

- BotFather の主なコマンド
  - `/newbot` で Bot を作成（トークン取得）
  - `/setwebapp` で Mini App の URL を登録（または `/setdomain`）
  - `/setmenu` でメニューに Web App を配置（任意）
- WebApp URL は `https://<your-domain>/` を指定

### 3. ngrok を使った Telegram クライアント検証

1) プロダクション相当で起動

```bash
pnpm run build
pnpm start
```

2) ngrok でポート3000を公開（別ターミナルで）

```bash
ngrok http 3000
```

3) 表示された `https://<your-ngrok>.ngrok-free.app` を WebApp URL に設定（BotFather）

4) Telegram クライアントで Bot を開き、Mini App を起動

※ 開発サーバー（`pnpm dev`）はホットリロード向けで、WebView の挙動が異なる場合があります。本番同等の確認は `start` 推奨。

### 4. 環境変数・設定

- `.env` に `WEB_URL` 等が必要な場合は追加してください（本リポジトリは未作成）。
- `.env` を直接上書きせず、`.env.example` を整備してチーム運用してください。

### 5. セキュリティヘッダー

- `next.config.mjs` に以下を設定済み
  - `Content-Security-Policy`: `frame-ancestors` に Telegram ドメインを許可、最低限の `script/style/img/connect` を許可
  - `X-Frame-Options: ALLOW-FROM https://web.telegram.org`
- 必要に応じて `connect-src` に TON 関連 API / RPC を追記してください。

### 6. 動作確認ポイント

- `src/app/page.tsx` で以下を表示
  - `isTMA`（Telegram内か判定）
  - `initData.user.id` / `initData.user.username`
- Telegram 内でユーザー情報が表示されれば OK です。
