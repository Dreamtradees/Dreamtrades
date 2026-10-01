"use client";

import { useEffect, useMemo, useState } from "react";

type Instrument = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  note: string;
};

const seed: Instrument[] = [
  {
    symbol: "EURUSD",
    name: "Euro / Dollar",
    price: 1.0842,
    change: 0.14,
    note: "Holding above Asia range. Waiting for London open confirmation.",
  },
  {
    symbol: "XAUUSD",
    name: "Gold",
    price: 2338.6,
    change: -0.22,
    note: "Soft bid into prior day mid. Attention on 2332 liquidity.",
  },
  {
    symbol: "NAS100",
    name: "Nasdaq 100",
    price: 19842,
    change: 0.41,
    note: "Trend intact. Watching for clean reclaim of session VWAP.",
  },
  {
    symbol: "BTCUSD",
    name: "Bitcoin",
    price: 64210,
    change: 0.68,
    note: "Higher-low structure. Ignore chop until 64.8k accepts.",
  },
];

function formatPrice(symbol: string, price: number) {
  if (symbol.includes("USD") && price < 10) return price.toFixed(4);
  if (price > 1000) return price.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return price.toFixed(2);
}

export function AttentionBoard() {
  const [focus, setFocus] = useState(1); // default to XAUUSD
  const [rows, setRows] = useState(seed);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRows((prev) =>
        prev.map((row, index) => {
          const drift = (Math.random() - 0.48) * (index === focus ? 0.08 : 0.03);
          const nextPrice = row.price * (1 + drift / 100);
          const nextChange = row.change + drift * 0.15;
          return { ...row, price: nextPrice, change: nextChange };
        }),
      );
    }, 1800);
    return () => window.clearInterval(id);
  }, [focus]);

  const active = useMemo(() => rows[focus], [rows, focus]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
          Attentive desk
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Hover to focus. Everything else softens.
        </h2>
        <p className="mt-3 max-w-md text-ink/65">
          LJ CIRCLE is built around selective attention — one instrument, one
          read, one clear next step.
        </p>
      </div>

      <div
        className="rounded-sm border border-ink/10 bg-[color-mix(in_srgb,white_55%,transparent)] p-2 backdrop-blur-sm"
        role="list"
        aria-label="Watchlist"
      >
        {rows.map((row, index) => {
          const activeRow = index === focus;
          return (
            <button
              key={row.symbol}
              type="button"
              role="listitem"
              onMouseEnter={() => setFocus(index)}
              onFocus={() => setFocus(index)}
              className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-all duration-300 ${
                activeRow
                  ? "bg-ink text-[#f4efe4]"
                  : "text-ink/45 hover:text-ink/70"
              }`}
            >
              <div>
                <p className="font-heading text-lg font-semibold tracking-tight">
                  {row.symbol}
                </p>
                <p className={`text-sm ${activeRow ? "text-[#f4efe4]/70" : ""}`}>
                  {row.name}
                </p>
              </div>
              <div className="text-right font-mono text-sm">
                <p>{formatPrice(row.symbol, row.price)}</p>
                <p className={row.change >= 0 ? "text-[#8fd0b0]" : "text-[#f0a090]"}>
                  {row.change >= 0 ? "+" : ""}
                  {row.change.toFixed(2)}%
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="lg:col-span-2">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/45">
          Focus note · {active.symbol}
        </p>
        <p className="mt-2 max-w-3xl font-heading text-2xl font-medium tracking-tight text-ink md:text-3xl">
          {active.note}
        </p>
      </div>
    </div>
  );
}
