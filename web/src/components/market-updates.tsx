"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Market } from "@/lib/markets";

type Quote = {
  ok: boolean;
  price?: number;
  updatedAt?: string;
  error?: string;
};

type UpdateItem = {
  id: string;
  time: string;
  title: string;
  body: string;
  tone: "neutral" | "bid" | "offer";
};

function buildUpdates(market: Market, price: number | null, prev: number | null): UpdateItem[] {
  const now = new Date();
  const stamp = (minsAgo: number) =>
    new Date(now.getTime() - minsAgo * 60_000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const drift =
    price != null && prev != null ? ((price - prev) / prev) * 100 : 0;
  const px =
    price == null ? "—" : price.toFixed(market.decimals);

  const liveTitle =
    price == null
      ? `Waiting on ${market.label}`
      : drift > 0.02
        ? `${market.label} lifting — stay selective`
        : drift < -0.02
          ? `${market.label} softening — no chase`
          : `${market.label} balanced — watch edges`;

  const liveBody =
    price == null
      ? `Connecting ${market.label} quote…`
      : drift > 0.02
        ? `${market.name} near ${px}. LJ CIRCLE stays with strength only while structure holds.`
        : drift < -0.02
          ? `${market.name} near ${px}. Wait for reclaim or a clean fade at prior supply.`
          : `${market.name} steady near ${px}. Focus on acceptance outside the last range.`;

  return [
    {
      id: "live",
      time: stamp(0),
      title: liveTitle,
      body: liveBody,
      tone: drift > 0.02 ? "bid" : drift < -0.02 ? "offer" : "neutral",
    },
    {
      id: "focus",
      time: stamp(10),
      title: "Desk focus",
      body: market.blurb,
      tone: "neutral",
    },
    {
      id: "risk",
      time: stamp(24),
      title: "Risk note",
      body: "One thesis at a time. If the level breaks, step aside — don’t invent a second story.",
      tone: "offer",
    },
  ];
}

export function MarketUpdates({ market }: { market: Market }) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [status, setStatus] = useState<"loading" | "live" | "error">("loading");
  const inFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setQuote(null);
    setPrevPrice(null);
    setHistory([]);

    const load = async () => {
      if (inFlight.current) return;
      inFlight.current = true;
      try {
        const res = await fetch(`/api/quote?symbol=${market.id}`, {
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        });
        const data = (await res.json()) as Quote;
        if (cancelled) return;
        if (data.ok && typeof data.price === "number") {
          setQuote((current) => {
            if (current?.price != null && current.price !== data.price) {
              setPrevPrice(current.price);
            }
            return data;
          });
          setHistory((h) => {
            const next = data.price!;
            if (h[h.length - 1] === next) return h;
            return [...h.slice(-31), next];
          });
          setStatus("live");
        } else {
          setQuote(data);
          setStatus("error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      } finally {
        inFlight.current = false;
      }
    };

    void load();
    const id = window.setInterval(() => void load(), 5000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [market.id]);

  const price = quote?.ok ? quote.price ?? null : null;
  const updates = useMemo(
    () => buildUpdates(market, price, prevPrice),
    [market, price, prevPrice],
  );
  const changePct =
    price != null && prevPrice != null
      ? ((price - prevPrice) / prevPrice) * 100
      : null;

  const spark = useMemo(() => {
    if (history.length < 2) return "";
    const min = Math.min(...history);
    const max = Math.max(...history);
    const span = max - min || 1;
    return history
      .map((value, index) => {
        const x = (index / (history.length - 1)) * 120;
        const y = 28 - ((value - min) / span) * 24;
        return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [history]);

  return (
    <div className="flex h-full flex-col">
      <div className="rounded-sm border border-ink/10 bg-[color-mix(in_srgb,white_65%,transparent)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
              {market.label} · live quote
            </p>
            <p className="mt-2 font-heading text-4xl font-semibold tracking-tight text-ink tabular-nums">
              {price != null
                ? price.toFixed(market.decimals)
                : status === "loading"
                  ? "…"
                  : "—"}
            </p>
            <p className="mt-1 font-mono text-sm text-ink/55">
              {status === "loading" && "Fetching quote…"}
              {status === "live" &&
                (changePct == null
                  ? "Live · updating every 5s"
                  : `${changePct >= 0 ? "+" : ""}${changePct.toFixed(3)}% · 5s refresh`)}
              {status === "error" && "Quote paused · retrying"}
            </p>
          </div>
          <svg width="120" height="36" viewBox="0 0 120 36" aria-hidden="true">
            <path
              d={spark || "M0,18 L120,18"}
              fill="none"
              stroke={changePct != null && changePct < 0 ? "#b42318" : "#1f6b57"}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="mt-5 flex-1 space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/45">
          Desk updates
        </p>
        {updates.map((item) => (
          <article
            key={item.id}
            className="border-t border-ink/10 pt-4 first:border-t-0 first:pt-0"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-ink/45">{item.time}</span>
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                  item.tone === "bid"
                    ? "text-tide"
                    : item.tone === "offer"
                      ? "text-[#b42318]"
                      : "text-signal"
                }`}
              >
                {item.tone}
              </span>
            </div>
            <h3 className="mt-1 font-heading text-lg font-semibold tracking-tight text-ink">
              {item.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink/65">{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
