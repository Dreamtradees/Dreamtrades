"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  AFFILIATE_REF_STORAGE_KEY,
  getAffiliate,
  normalizeAffiliateSlug,
  type Affiliate,
} from "@/lib/affiliates";
import { BRAND_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = {
  tone?: "light" | "dark";
  active?: "home" | "learn";
  /** Server-known ref from ?ref= (preferred on first paint). */
  initialRef?: string;
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

/**
 * When a face-brand affiliate ref is active, chrome shows her brand
 * (header/footer) instead of DreamTrades.
 */
export function AffiliateFaceShell({
  tone = "light",
  active,
  initialRef,
  children,
}: Props) {
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
  const learnHref = affiliate
    ? active === "learn"
      ? "#learn-path"
      : `/learn?ref=${encodeURIComponent(affiliate.slug)}`
    : active === "learn"
      ? "#learn-path"
      : "/learn";
  const ctaLabel = affiliate?.ctaLabel ?? "Start Learning";
  const footerNote =
    affiliate?.footerNote ??
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link
            href={homeHref}
            className={cn(
              "font-heading text-lg font-bold tracking-tight md:text-xl",
              dark ? "text-[#f4f7f8]" : "text-ink",
            )}
          >
            {brand}
          </Link>
          <nav className="flex items-center gap-2 md:gap-3">
            <Link
              href={
                affiliate
                  ? `/learn?ref=${encodeURIComponent(affiliate.slug)}`
                  : "/learn"
              }
              className={cn(
                "hidden px-3 py-2 text-sm font-medium transition-colors sm:inline",
                dark
                  ? "text-[#f4f7f8]/75 hover:text-[#f4f7f8]"
                  : "text-ink/65 hover:text-ink",
                active === "learn" && (dark ? "text-[#f4f7f8]" : "text-ink"),
              )}
            >
              Curriculum
            </Link>
            {!affiliate ? (
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
                  Live gold
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
                  Why this
                </Link>
              </>
            ) : null}
            <Link
              href={learnHref}
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
            <p className="mt-2 text-sm text-ink/50">
              {affiliate ? (
                <Link
                  href={`/learn?ref=${encodeURIComponent(affiliate.slug)}`}
                  className="text-ink/70 underline decoration-ink/25 underline-offset-4 hover:text-ink"
                >
                  Start the curriculum
                </Link>
              ) : (
                <>
                  Share this starter pack with the crew:{" "}
                  <Link
                    href="/learn"
                    className="text-ink/70 underline decoration-ink/25 underline-offset-4 hover:text-ink"
                  >
                    /learn
                  </Link>
                </>
              )}
            </p>
          </div>
          <div className="flex gap-5 text-sm text-ink/60">
            <Link
              href={
                affiliate
                  ? `/learn?ref=${encodeURIComponent(affiliate.slug)}`
                  : "/learn"
              }
              className="hover:text-ink"
            >
              Curriculum
            </Link>
            {affiliate ? (
              <Link href={`/with/${affiliate.slug}`} className="hover:text-ink">
                Home
              </Link>
            ) : (
              <Link href="/#path" className="hover:text-ink">
                Path
              </Link>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
