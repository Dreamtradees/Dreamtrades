import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LearnPath } from "@/components/learn-path";
import { LiveGoldDesk } from "@/components/live-gold-desk";
import { BRAND_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Curriculum — ${BRAND_NAME}`,
  description:
    "Plain-English trading fundamentals for newbies: long vs short, pairs, candles, supply & demand, risk, and a before-you-trade checklist.",
};

export default function LearnPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader tone="light" active="learn" />
      <section id="learn-path" className="scroll-mt-4 pb-4 pt-6 md:pt-10">
        <LearnPath />
      </section>
      <div className="border-t border-ink/10 bg-sheet/50">
        <LiveGoldDesk variant="advanced" />
      </div>
      <SiteFooter />
    </main>
  );
}
