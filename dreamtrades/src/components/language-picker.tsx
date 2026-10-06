"use client";

import { useLocaleOptional } from "@/components/locale-provider";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Compact language picker — EN / FR / ES / AR for Morocco, UAE, Spain, France.
 */
export function LanguagePicker({ tone = "light", className }: Props) {
  const { locale, setLocale, messages } = useLocaleOptional();
  const dark = tone === "dark";

  return (
    <label
      className={cn(
        "inline-flex items-center gap-1.5 text-sm",
        dark ? "text-[#f4f7f8]/75" : "text-ink/65",
        className,
      )}
    >
      <span className="sr-only">{messages.langLabel}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label={messages.langLabel}
        data-testid="language-picker"
        className={cn(
          "cursor-pointer appearance-none rounded-md border bg-transparent px-2.5 py-1.5 text-xs font-medium tracking-wide outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-mark/50",
          dark
            ? "border-[#f4f7f8]/25 text-[#f4f7f8] hover:border-[#f4f7f8]/45 hover:bg-[#f4f7f8]/8"
            : "border-ink/15 text-ink hover:border-ink/30 hover:bg-ink/5",
        )}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code} className="bg-sheet text-ink">
            {LOCALE_META[code].native} · {LOCALE_META[code].label}
          </option>
        ))}
      </select>
    </label>
  );
}
