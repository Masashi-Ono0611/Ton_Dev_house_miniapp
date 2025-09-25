"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Minimal types to avoid extra deps
interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramInitDataUnsafe {
  user?: TelegramUser;
  start_param?: string;
  auth_date?: string | number;
  hash?: string;
}

interface TelegramWebAppLike {
  initDataUnsafe?: TelegramInitDataUnsafe;
  colorScheme?: "light" | "dark";
  themeParams?: Record<string, string>;
  isExpanded?: boolean;
  headerColor?: string;
  backgroundColor?: string;
  expand?: () => void;
  ready?: () => void;
}

type TelegramContextValue = {
  isTMA: boolean;
  tg: TelegramWebAppLike | null;
  initData: TelegramInitDataUnsafe | null;
};

const TelegramContext = createContext<TelegramContextValue>({ isTMA: false, tg: null, initData: null });

// Dev mock to enable local browser usage
function createDevMock(): TelegramWebAppLike {
  return {
    initDataUnsafe: {
      user: {
        id: 123456789,
        first_name: "Dev",
        last_name: "User",
        username: "dev_user",
        language_code: "en",
      },
      start_param: "dev",
      auth_date: Date.now(),
      hash: "mock",
    },
    colorScheme: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    themeParams: {},
    isExpanded: true,
    headerColor: "#00000000",
    backgroundColor: "#00000000",
    expand: () => {},
    ready: () => {},
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebAppLike };
  }
}

export function TelegramAppProvider({ children }: { children: React.ReactNode }) {
  const [tg, setTg] = useState<TelegramWebAppLike | null>(null);

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";
    if (!isBrowser) return;

    const webApp = window.Telegram?.WebApp;

    if (webApp) {
      // In Telegram
      try {
        webApp.ready?.();
        webApp.expand?.();
      } catch {}
      setTg(webApp);
      return;
    }

    // Not in Telegram: enable mock only in development
    if (process.env.NODE_ENV === "development") {
      setTg(createDevMock());
    } else {
      setTg(null);
    }
  }, []);

  const value = useMemo<TelegramContextValue>(() => {
    return {
      isTMA: !!(typeof window !== "undefined" && window.Telegram?.WebApp) || process.env.NODE_ENV === "development",
      tg,
      initData: tg?.initDataUnsafe ?? null,
    };
  }, [tg]);

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}

export function useTelegram() {
  return useContext(TelegramContext);
}
