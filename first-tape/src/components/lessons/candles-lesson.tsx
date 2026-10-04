"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Candle = { id: string; label: string; open: number; high: number; low: number; close: number };

const candles: Candle[] = [
  { id: "bull", label: "Bullish", open: 100, high: 118, low: 97, close: 114 },
  { id: "bear", label: "Bearish", open: 114, high: 116, low: 92, close: 96 },
  { id: "doji", label: "Indecision", open: 105, high: 112, low: 98, close: 106 },
];

export function CandlesLesson() {
  const [activeId, setActiveId] = useState(candles[0].id);
  const candle = candles.find((c) => c.id === activeId) ?? candles[0];
  const bullish = candle.close >= candle.open;
  const stats: { label: string; value: number; accent?: "up" | "down" }[] = [
    { label: "Open", value: candle.open },
    { label: "High", value: candle.high },
    { label: "Low", value: candle.low },
    { label: "Close", value: candle.close, accent: bullish ? "up" : "down" },
  ];

  return (
    <section id="candles" className="scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.22em] text-tide uppercase">03 · Candles</p>
        <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">Every candle is a story of open, high, low, close.</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Select a candle. Read OHLC before you invent a narrative. The body shows open→close; the wicks show the extremes buyers and sellers explored.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="flex items-end justify-center gap-6 rounded-xl border border-ink/10 bg-white/45 px-6 py-10 backdrop-blur-sm">
            {candles.map((item) => {
              const up = item.close >= item.open;
              const min = Math.min(item.open, item.close, item.low);
              const max = Math.max(item.open, item.close, item.high);
              const scale = 140 / (max - min || 1);
              const y = (v: number) => 160 - (v - min) * scale;
              const bodyTop = y(Math.max(item.open, item.close));
              const bodyBottom = y(Math.min(item.open, item.close));
              const bodyHeight = Math.max(bodyBottom - bodyTop, 4);
              return (
                <button key={item.id} type="button" onClick={() => setActiveId(item.id)} className={cn("group flex flex-col items-center gap-3 transition-transform duration-300", activeId === item.id ? "-translate-y-1" : "opacity-70 hover:opacity-100")} aria-pressed={activeId === item.id}>
                  <svg viewBox="0 0 40 170" className="h-44 w-10">
                    <line x1="20" x2="20" y1={y(item.high)} y2={y(item.low)} stroke={up ? "#0b8a5c" : "#b83a2e"} strokeWidth="2" />
                    <rect x="10" y={bodyTop} width="20" height={bodyHeight} rx="2" fill={up ? "#0b8a5c" : "#b83a2e"} />
                  </svg>
                  <span className="font-mono text-xs tracking-wide text-ink">{item.label}</span>
                </button>
              );
            })}
          </div>
          <div>
            <p className="font-mono text-sm text-tide">Selected · {candle.label} · {bullish ? "Close ≥ Open" : "Close < Open"}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="border-t border-ink/15 pt-3">
                  <dt className="font-mono text-xs tracking-wide text-muted-foreground uppercase">{stat.label}</dt>
                  <dd className={cn("mt-1 font-heading text-2xl font-bold text-ink", stat.accent === "up" && "text-up", stat.accent === "down" && "text-down")}>{stat.value.toFixed(2)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
              {candle.id === "doji"
                ? "Open and close are nearly equal. Pressure was contested. Wait for confirmation instead of forcing a trade."
                : bullish
                  ? "Buyers finished stronger than sellers in this period. That is information — not a buy signal by itself."
                  : "Sellers finished stronger than buyers in this period. Again: information first, decision second."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
