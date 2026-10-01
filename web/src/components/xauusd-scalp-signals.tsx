"use client";

import { useEffect, useState } from "react";
import { MarketChart } from "@/components/market-chart";
import { getMarket } from "@/lib/markets";
import { cn } from "@/lib/utils";

type ScalpSignal = {
  id: string;
  time: string;
  side: "BUY" | "SELL";
  price: number;
  strength: "soft" | "solid";
  reason: string;
};

type ScalpPayload = {
  ok: boolean;
  bias?: "BUY" | "SELL" | "WAIT";
  biasReason?: string;
  price?: number;
  last?: ScalpSignal | null;
  recent?: ScalpSignal[];
  updatedAt?: string;
  disclaimer?: string;
  error?: string;
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function XauusdScalpSignals() {
  const [data, setData] = useState<ScalpPayload | null>(null);
  const gold = getMarket("XAUUSD");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/xauusd/scalp", { cache: "no-store" });
        const json = (await res.json()) as ScalpPayload;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData({ ok: false, error: "Scalp feed unavailable" });
      }
    };
    void load();
    const id = window.setInterval(() => void load(), 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const bias = data?.bias ?? "WAIT";

  return (
    <section id="scalp" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
          XAUUSD · scalping
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Fast gold signals
        </h2>
        <p className="mt-3 text-ink/65">
          M1 EMA/RSI scalp read with a short chart. Built for quick decisions —
          not for holding through noise.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <MarketChart market={gold} height={400} variant="full" />

        <div className="space-y-4">
          <div
            className={cn(
              "rounded-sm border p-5",
              bias === "BUY" && "border-tide/40 bg-[color-mix(in_srgb,#0d8a6f_10%,white)]",
              bias === "SELL" && "border-[#b42318]/35 bg-[color-mix(in_srgb,#b42318_8%,white)]",
              bias === "WAIT" && "border-ink/10 bg-[color-mix(in_srgb,white_65%,transparent)]",
            )}
          >
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/50">
              Active scalp bias
            </p>
            <p className="mt-2 font-heading text-4xl font-semibold tracking-tight text-ink">
              {bias}
            </p>
            <p className="mt-2 text-sm text-ink/65">
              {data?.biasReason || "Loading scalp engine…"}
            </p>
            <p className="mt-3 font-mono text-xs text-ink/45">
              {data?.price != null ? `Proxy ${data.price.toFixed(2)}` : "—"} ·
              refresh ~15s
            </p>
          </div>

          {data?.last ? (
            <div className="rounded-sm border border-ink/10 bg-[color-mix(in_srgb,white_70%,transparent)] p-5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/50">
                Latest trigger
              </p>
              <p
                className={cn(
                  "mt-2 font-heading text-2xl font-semibold",
                  data.last.side === "BUY" ? "text-tide" : "text-[#b42318]",
                )}
              >
                {data.last.side} · {data.last.price.toFixed(2)}
              </p>
              <p className="mt-1 text-sm text-ink/65">{data.last.reason}</p>
              <p className="mt-2 font-mono text-xs text-ink/45">
                {fmtTime(data.last.time)} · {data.last.strength}
              </p>
            </div>
          ) : null}

          <div className="rounded-sm border border-ink/10 bg-[color-mix(in_srgb,white_70%,transparent)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/50">
              Recent scalp signals
            </p>
            <ul className="mt-3 space-y-3">
              {(data?.recent || []).length === 0 ? (
                <li className="text-sm text-ink/55">No fresh triggers yet.</li>
              ) : (
                data?.recent?.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-start justify-between gap-3 border-t border-ink/8 pt-3 first:border-t-0 first:pt-0"
                  >
                    <div>
                      <p
                        className={cn(
                          "font-heading text-base font-semibold",
                          s.side === "BUY" ? "text-tide" : "text-[#b42318]",
                        )}
                      >
                        {s.side} {s.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-ink/55">{s.reason}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-ink/45">
                      {fmtTime(s.time)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink/45">
        {data?.disclaimer ||
          "Educational signals only. Futures proxy quotes can differ from your broker XAUUSD feed."}
      </p>
    </section>
  );
}
