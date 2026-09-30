"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MARKETS, getMarket, type MarketId } from "@/lib/markets";
import { MarketChart } from "@/components/market-chart";
import { MarketUpdates } from "@/components/market-updates";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  showLink?: boolean;
  chartVariant?: "lite" | "full";
  chartHeight?: number;
  initialSymbol?: MarketId;
};

export function MarketDesk({
  showLink = true,
  chartVariant = "lite",
  chartHeight = 420,
  initialSymbol = "XAUUSD",
}: Props) {
  const [symbol, setSymbol] = useState<MarketId>(initialSymbol);
  const market = useMemo(() => getMarket(symbol), [symbol]);

  return (
    <section id="xauusd" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-tide">
            Markets desk
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {market.label} — {market.name}
          </h2>
          <p className="mt-3 text-ink/65">{market.blurb}</p>
        </div>
        {showLink ? (
          <Link
            href="/watch/xauusd"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-sm bg-ink px-5 text-primary-foreground hover:bg-tide",
            )}
          >
            Open full markets desk
          </Link>
        ) : null}
      </div>

      <div
        className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Market pairs"
      >
        {MARKETS.map((item) => {
          const active = item.id === symbol;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSymbol(item.id)}
              className={cn(
                "shrink-0 rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors",
                active
                  ? "bg-ink text-[#f4efe4]"
                  : "bg-ink/5 text-ink/65 hover:bg-ink/10 hover:text-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
        <MarketChart
          key={`${market.id}-${chartVariant}`}
          market={market}
          height={chartHeight}
          variant={chartVariant}
        />
        <MarketUpdates key={market.id} market={market} />
      </div>
    </section>
  );
}
