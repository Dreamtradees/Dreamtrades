import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LearnPath } from "@/components/learn-path";
import { LiveGoldDesk } from "@/components/live-gold-desk";
import { buttonVariants } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Curriculum — ${BRAND_NAME}`,
  description:
    "Plain-English trading fundamentals for newbies: long vs short, pairs, candles, supply & demand, risk, and a before-you-trade checklist.",
};

export default function LearnPage() {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden bg-ink pb-10 pt-0 text-[#f4f7f8]">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-50" />
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,#0f9f8a44,transparent_70%)] blur-2xl" />
        <SiteHeader tone="dark" />
        <div className="relative mx-auto max-w-6xl px-5 pb-4 pt-28 md:px-8 md:pt-32">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.2em] text-mark">
            {BRAND_NAME} · curriculum
          </p>
          <h1 className="animate-rise-delay mt-3 max-w-3xl font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Fundamentals before you risk a dollar
          </h1>
          <p className="animate-rise-late mt-4 max-w-2xl text-[#f4f7f8]/72 md:text-lg">
            Seven short lessons with step-by-step pictures — including how to
            mark supply & demand zones. Interactive demos. A checklist you can
            tick. Built to teach judgment — not signal-following.
          </p>
          <div className="animate-rise-late mt-8 flex flex-wrap gap-3">
            <Link href="#learn-path" className={cn(buttonVariants({ size: "lg" }), "rounded-md bg-mark px-5 text-[#041512] hover:bg-[#14b8a0]")}>
              Start the path
            </Link>
            <Link href="#live-gold" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-md border-[#f4f7f8]/30 bg-transparent px-5 text-[#f4f7f8] hover:bg-[#f4f7f8]/10 hover:text-[#f4f7f8]")}>
              Live gold desk
            </Link>
          </div>
        </div>
      </div>
      <section id="learn-path" className="py-16 md:py-24">
        <LearnPath />
      </section>
      <div className="border-t border-ink/10 bg-sheet/50">
        <LiveGoldDesk variant="advanced" />
      </div>
      <SiteFooter />
    </main>
  );
}
