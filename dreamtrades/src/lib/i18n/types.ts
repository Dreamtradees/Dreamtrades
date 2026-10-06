export const LOCALES = ["en", "fr", "es", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "sara_lang";

export const LOCALE_META: Record<
  Locale,
  { label: string; native: string; dir: "ltr" | "rtl" }
> = {
  en: { label: "English", native: "EN", dir: "ltr" },
  fr: { label: "Français", native: "FR", dir: "ltr" },
  es: { label: "Español", native: "ES", dir: "ltr" },
  ar: { label: "العربية", native: "AR", dir: "rtl" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(raw: unknown): Locale | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toLowerCase();
  return isLocale(v) ? v : null;
}
