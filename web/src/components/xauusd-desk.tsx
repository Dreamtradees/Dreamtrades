import Link from "next/link";
import { XauusdChart } from "@/components/xauusd-chart";
import { XauusdUpdates } from "@/components/xauusd-updates";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  showLink?: boolean;
};

export function XauusdDesk({ showLink = true }: Props) {
  return (
    <section id="xauusd" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-tide">
            Featured market
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            XAUUSD — gold under DreamTrades attention
          </h2>
          <p className="mt-3 text-ink/65">
            Live TradingView chart, rolling quote, and desk notes so you can
            watch gold without drowning in noise.
          </p>
        </div>
        {showLink ? (
          <Link
            href="/watch/xauusd"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-sm bg-ink px-5 text-primary-foreground hover:bg-tide",
            )}
          >
            Open full gold desk
          </Link>
        ) : null}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
        <XauusdChart height={540} />
        <XauusdUpdates />
      </div>
    </section>
  );
}
