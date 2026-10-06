"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  LOCALE_STORAGE_KEY,
  getMessages,
  normalizeLocale,
  type Locale,
  type Messages,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (next: Locale) => void;
  dir: "ltr" | "rtl";
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale | null {
  try {
    return normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return null;
  }
}

function writeStoredLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}

function readQueryLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  return normalizeLocale(new URLSearchParams(window.location.search).get("lang"));
}

function syncUrlLang(locale: Locale) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (locale === DEFAULT_LOCALE) {
    url.searchParams.delete("lang");
  } else {
    url.searchParams.set("lang", locale);
  }
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  const meta = LOCALE_META[locale];
  document.documentElement.lang = locale;
  document.documentElement.dir = meta.dir;
  document.documentElement.dataset.locale = locale;
}

type Props = {
  /** Server-known locale from ?lang= for first paint */
  initialLocale?: Locale;
  children: ReactNode;
};

export function LocaleProvider({ initialLocale, children }: Props) {
  const [locale, setLocaleState] = useState<Locale>(
    () => normalizeLocale(initialLocale) ?? DEFAULT_LOCALE,
  );

  useEffect(() => {
    const fromQuery = readQueryLocale();
    const fromStore = readStoredLocale();
    const resolved = fromQuery ?? fromStore ?? normalizeLocale(initialLocale) ?? DEFAULT_LOCALE;
    setLocaleState(resolved);
    applyDocumentLocale(resolved);
    writeStoredLocale(resolved);
    if (fromQuery) syncUrlLang(resolved);
  }, [initialLocale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeStoredLocale(next);
    syncUrlLang(next);
    applyDocumentLocale(next);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      messages: getMessages(locale),
      setLocale,
      dir: LOCALE_META[locale].dir,
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

/** Safe for chrome that may render outside a provider (falls back to EN). */
export function useLocaleOptional(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (ctx) return ctx;
  return {
    locale: DEFAULT_LOCALE,
    messages: getMessages(DEFAULT_LOCALE),
    setLocale: () => undefined,
    dir: "ltr",
  };
}
