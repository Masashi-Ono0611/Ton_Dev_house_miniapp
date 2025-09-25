import type { Metadata } from "next";
import "./globals.css";
import { Providers, ThemeScript } from "./_components/ChakraProviders";

export const metadata: Metadata = {
  title: "Next.js Starter",
  description: "Simple Next.js + Chakra UI App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ThemeScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
