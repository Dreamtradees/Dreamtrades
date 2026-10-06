"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { LanguagePicker } from "@/components/language-picker";
import { LocaleProvider, useLocaleOptional } from "@/components/locale-provider";
import { buttonVariants } from "@/components/ui/button";
import {
  AFFILIATE_REF_STORAGE_KEY,
  getAffiliate,
  normalizeAffiliateSlug,
  type Affiliate,
} from "@/lib/affiliates";
import { getAffiliateCopy, normalizeLocale, type Locale } from "@/lib/i18n";
import { BRAND_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = {
  tone?: "light" | "dark";
  active?: "home" | "learn";
  /** Server-known ref from ?ref= (preferred on first paint). */
  initialRef?: string;
  initialLocale?: Locale;
  children: ReactNode;
};

function resolveAffiliate(initialRef?: string): Affiliate | null {
  if (typeof window === "undefined") {
    const slug = normalizeAffiliateSlug(initialRef ?? "");
    return slug ? getAffiliate(slug) ?? null : null;
  }
  const fromQuery = normalizeAffiliateSlug(
    new URLSearchParams(window.location.search).get("ref") ?? "",
  );
  let fromStore = "";
  try {
    fromStore = normalizeAffiliateSlug(
      sessionStorage.getItem(AFFILIATE_REF_STORAGE_KEY) ?? "",
    );
  } catch {
    /* ignore */
  }
  const slug =
    fromQuery || fromStore || normalizeAffiliateSlug(initialRef ?? "");
  return slug ? getAffiliate(slug) ?? null : null;
}

function scrollToLearnPath(event: MouseEvent<HTMLAnchorElement>) {
  if (typeof window === "undefined") return;
  if (!window.location.pathname.startsWith("/learn")) return;
  event.preventDefault();
  const el = document.getElementById("learn-path");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#learn-path`);
  }
}

function AffiliateFaceChrome({
  tone = "light",
  active,
  initialRef,
  children,
}: Omit<Props, "initialLocale">) {
  const { locale, messages } = useLocaleOptional();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(() => {
    const slug = normalizeAffiliateSlug(initialRef ?? "");
    return slug ? getAffiliate(slug) ?? null : null;
  });

  useEffect(() => {
    setAffiliate(resolveAffiliate(initialRef));
  }, [initialRef]);

  const dark = tone === "dark";
  const brand = affiliate?.name ?? BRAND_NAME;
  const homeHref = affiliate ? `/with/${affiliate.slug}` : "/";
  const curriculumHref = affiliate
    ? active === "learn"
      ? "#learn-path"
      : `/learn?ref=${encodeURIComponent(affiliate.slug)}#learn-path`
    : active === "learn"
      ? "#learn-path"
      : "/learn#learn-path";
  const startHref = affiliate
    ? active === "learn"
      ? "#trade"
      : `/learn?ref=${encodeURIComponent(affiliate.slug)}#trade`
    : active === "learn"
      ? "#trade"
      : "/learn#trade";

  const copy = affiliate
    ? getAffiliateCopy(locale, affiliate.slug, {
        eyebrow: affiliate.eyebrow,
        tagline: affiliate.tagline,
        blurb: affiliate.blurb,
        ctaLabel: affiliate.ctaLabel,
        footerNote: affiliate.footerNote,
      })
    : null;
  const ctaLabel = copy?.ctaLabel ?? messages.nav.startLearning;
  const footerNote =
    copy?.footerNote ??
    "Teaching product for the DreamTrades group. Not financial advice.";

  return (
    <>
      <header
        className={cn(
          dark
            ? "absolute inset-x-0 top-0 z-20"
            : "relative z-20 border-b border-ink/10 bg-sheet/80 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5 md:px-8">
          <Link
            href={homeHref}
            className={cn(
              "font-heading text-lg font-bold tracking-tight md:text-xl",
              dark ? "text-[#f4f7f8]" : "text-ink",
            )}
          >
            {brand}
          </Link>
          <nav className="flex items-center gap-1.5 md:gap-3">
            <LanguagePicker tone={dark ? "dark" : "light"} className="me-1" />
            <Link
              href={curriculumHref}
              onClick={active === "learn" ? scrollToLearnPath : undefined}
              className={cn(
                "hidden px-3 py-2 text-sm font-medium transition-colors sm:inline",
                dark
                  ? "text-[#f4f7f8]/75 hover:text-[#f4f7f8]"
                  : "text-ink/65 hover:text-ink",
                active === "learn" && (dark ? "text-[#f4f7f8]" : "text-ink"),
              )}
              data-testid="nav-curriculum"
            >
              {messages.nav.curriculum}
            </Link>
            {affiliate ? (
              <Link
                href={`/with/${affiliate.slug}#how`}
                className={cn(
                  "hidden px-3 py-2 text-sm font-medium transition-colors md:inline",
                  dark
                    ? "text-[#f4f7f8]/75 hover:text-[#f4f7f8]"
                    : "text-ink/65 hover:text-ink",
                )}
              >
                {messages.nav.howItWorks}
              </Link>
            ) : (
              <>
                <Link
                  href={active === "learn" ? "#live-gold" : "/#live-gold"}
                  className={cn(
                    "hidden px-3 py-2 text-sm font-medium transition-colors md:inline",
                    dark
                      ? "text-[#f4f7f8]/75 hover:text-[#f4f7f8]"
                      : "text-ink/65 hover:text-ink",
                  )}
                >
                  {messages.nav.liveGold}
                </Link>
                <Link
                  href="/#path"
                  className={cn(
                    "hidden px-3 py-2 text-sm font-medium transition-colors lg:inline",
                    dark
                      ? "text-[#f4f7f8]/75 hover:text-[#f4f7f8]"
                      : "text-ink/65 hover:text-ink",
                  )}
                >
                  {messages.nav.whyThis}
                </Link>
              </>
            )}
            <Link
              href={startHref}
              data-testid="start-learning"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-md px-4",
                dark
                  ? "bg-mark text-[#041512] hover:bg-[#14b8a0]"
                  : "bg-ink text-[#f4f7f8] hover:bg-[#1c2530]",
              )}
            >
              {ctaLabel}
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-heading text-lg font-bold tracking-tight text-ink">
              {brand}
            </p>
            <p className="mt-1 text-sm text-ink/55">{footerNote}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm text-ink/60">
            <LanguagePicker tone="light" />
            {affiliate ? (
              <Link href={`/with/${affiliate.slug}#how`} className="hover:text-ink">
                {messages.nav.howItWorks}
              </Link>
            ) : null}
            <Link
              href={curriculumHref}
              onClick={active === "learn" ? scrollToLearnPath : undefined}
              className="hover:text-ink"
            >
              {messages.nav.curriculum}
            </Link>
            <Link href={homeHref} className="hover:text-ink">
              {messages.nav.home}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

/**
 * When a face-brand affiliate ref is active, chrome shows her brand
 * (header/footer) instead of DreamTrades.
 */
export function AffiliateFaceShell({
  tone = "light",
  active,
  initialRef,
  initialLocale,
  children,
}: Props) {
  return (
    <LocaleProvider initialLocale={normalizeLocale(initialLocale) ?? undefined}>
      <AffiliateFaceChrome tone={tone} active={active} initialRef={initialRef}>
        {children}
      </AffiliateFaceChrome>
    </LocaleProvider>
  );
}
