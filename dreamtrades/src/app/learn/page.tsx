import type { Metadata } from "next";
import { AffiliateFaceShell } from "@/components/affiliate-face-shell";
import { AffiliateRefCapture } from "@/components/affiliate-ref-capture";
import { LearnPath } from "@/components/learn-path";
import { LiveGoldDesk } from "@/components/live-gold-desk";
import { getAffiliate, normalizeAffiliateSlug } from "@/lib/affiliates";
import { getMessages, normalizeLocale } from "@/lib/i18n";
import { BRAND_NAME } from "@/lib/site";

type PageProps = {
  searchParams: Promise<{ ref?: string; lang?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const slug = normalizeAffiliateSlug(params.ref ?? "");
  const locale = normalizeLocale(params.lang) ?? "en";
  const m = getMessages(locale);
  const affiliate = slug ? getAffiliate(slug) : undefined;
  if (affiliate) {
    return {
      title: `${m.nav.curriculum} — ${affiliate.name}`,
      description: affiliate.blurb,
    };
  }
  return {
    title: `${m.nav.curriculum} — ${BRAND_NAME}`,
    description:
      "Plain-English trading fundamentals for newbies: long vs short, pairs, candles, supply & demand, risk, and a before-you-trade checklist.",
  };
}

export default async function LearnPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialRef = normalizeAffiliateSlug(params.ref ?? "");
  const initialLocale = normalizeLocale(params.lang) ?? undefined;

  return (
    <main className="min-h-screen">
      <AffiliateRefCapture />
      <AffiliateFaceShell
        tone="light"
        active="learn"
        initialRef={initialRef}
        initialLocale={initialLocale}
      >
        <section id="learn-path" className="scroll-mt-4 pb-4 pt-6 md:pt-10">
          <LearnPath />
        </section>
        <div className="border-t border-ink/10 bg-sheet/50">
          <LiveGoldDesk variant="advanced" />
        </div>
      </AffiliateFaceShell>
    </main>
  );
}
