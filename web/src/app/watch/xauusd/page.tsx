import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MarketDesk } from "@/components/market-desk";
import { XauusdScalpSignals } from "@/components/xauusd-scalp-signals";
import { Join } from "@/components/join";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MarketsWatchPage() {
  return (
    <main className="min-h-screen">
      <div className="relative bg-ink pb-8 pt-0">
        <SiteHeader />
        <div className="h-20" />
      </div>
      <section className="mx-auto max-w-6xl px-5 pb-4 pt-12 md:px-8 md:pt-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              LJ CIRCLE · markets
            </p>
            <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              Gold & forex desk
            </h1>
            <p className="mt-4 text-ink/65">
              Live XAUUSD price, TradingView charts, and majors — then scan the
              QR to join the Telegram circle.
            </p>
          </div>
          <Link
            href="/#join"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-sm bg-[#c4a35a] px-5 text-ink hover:bg-[#e8d19a]",
            )}
          >
            Join Telegram
          </Link>
        </div>
      </section>
      <MarketDesk showLink={false} chartVariant="full" chartHeight={560} />
      <XauusdScalpSignals />
      <Join />
      <SiteFooter />
    </main>
  );
}
