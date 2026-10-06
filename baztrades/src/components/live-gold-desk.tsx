import Link from "next/link";
import { XauusdChart } from "@/components/xauusd-chart";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "overview" | "advanced";
  showLearnCta?: boolean;
};

export function LiveGoldDesk({
  variant = "advanced",
  showLearnCta = false,
}: Props) {
  return (
    <section id="live-gold" className="scroll-mt-8 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mark">
              Live gold desk · XAUUSD
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Read the live chart while you learn
            </h2>
            <p className="mt-3 text-ink/65 md:text-lg">
              Practice spotting structure on real XAUUSD price — open, high, low,
              close, and how buyers and sellers leave footprints. This is a study
              tool, not a signal feed.
            </p>
          </div>
          {showLearnCta ? (
            <Link
              href="/learn"
              data-testid="desk-start-learning"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-sm bg-ink px-5 text-[#faf7f0] hover:bg-[#2a221c]",
              )}
            >
              Enter the floor
            </Link>
          ) : (
            <p className="max-w-xs font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">
              Symbol · OANDA:XAUUSD · TradingView
            </p>
          )}
        </div>
        <div className="mt-8 md:mt-10">
          <XauusdChart
            variant={variant}
            height={variant === "advanced" ? 520 : 420}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink/55">
          Tip: pick one timeframe (for example 15m or 1H) and stay with it while
          you work through pairs, candles, and supply &amp; demand. Charts show
          price history — they do not remove risk.
        </p>
      </div>
    </section>
  );
}
