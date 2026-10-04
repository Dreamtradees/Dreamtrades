import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LearnFundamentals } from "@/components/learn-fundamentals";
import { Join } from "@/components/join";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Learn trading fundamentals — LJ CIRCLE",
  description:
    "Plain-English trading basics for newbies: long vs short, XAUUSD pairs, candles, risk, and a before-you-trade checklist.",
};

export default function LearnPage() {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden bg-ink pb-10 pt-0 text-[#f4f7fb]">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,#c4a35a33,transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute left-1/3 top-24 h-40 w-40 rounded-full border border-[#c4a35a]/20" />
        <SiteHeader />
        <div className="relative mx-auto max-w-6xl px-5 pb-4 pt-28 md:px-8 md:pt-32">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.2em] text-[#c4a35a]">
            LJ CIRCLE · learn
          </p>
          <h1 className="animate-rise-delay mt-3 max-w-3xl font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            Fundamentals before the live desk
          </h1>
          <p className="animate-rise-late mt-4 max-w-2xl text-[#f4f7fb]/72 md:text-lg">
            Six short lessons. Interactive long/short demo. A checklist you can
            tick. Then jump back to XAUUSD with a clearer head.
          </p>
          <div className="animate-rise-late mt-8 flex flex-wrap gap-3">
            <Link
              href="#learn-path"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-sm bg-[#c4a35a] px-5 text-ink hover:bg-[#e8d19a]",
              )}
            >
              Start the path
            </Link>
            <Link
              href="/#xauusd"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-sm border-[#f4f7fb]/30 bg-transparent px-5 text-[#f4f7fb] hover:bg-[#f4f7fb]/10 hover:text-[#f4f7fb]",
              )}
            >
              Skip to live XAUUSD
            </Link>
          </div>
        </div>
      </div>

      <section id="learn-path" className="py-16 md:py-24">
        <LearnFundamentals />
      </section>

      <Join />
      <SiteFooter />
    </main>
  );
}
