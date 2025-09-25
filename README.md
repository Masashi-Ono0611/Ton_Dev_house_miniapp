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
  - `api/version/route.ts` バージョン表示用のAPIエンドポイント例
- `src/app/_components/ChakraProviders.tsx` Chakra UIのProvider設定
- `tsconfig.json` TypeScript設定 (JSONのimport対応など)
- `next.config.mjs` Next.js設定

## 備考

- コード内のコメント・ログは英語、READMEなどのドキュメントは日本語方針です。
- .env は作成していません。必要になった場合は `.env.example` を追加してください。
