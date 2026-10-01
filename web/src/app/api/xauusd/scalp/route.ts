import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type ScalpSignal = {
  id: string;
  time: string;
  side: "BUY" | "SELL";
  price: number;
  strength: "soft" | "solid";
  reason: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __dreamtradesScalpCache:
    | { at: number; payload: Record<string, unknown> }
    | undefined;
}

const CACHE_MS = 15_000;

function ema(values: number[], period: number): number[] {
  const out: number[] = [];
  const k = 2 / (period + 1);
  let prev = values[0];
  out.push(prev);
  for (let i = 1; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out.push(prev);
  }
  return out;
}

function rsi(values: number[], period: number): number[] {
  const out: number[] = new Array(values.length).fill(50);
  if (values.length <= period) return out;

  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) avgGain += diff;
    else avgLoss -= diff;
  }
  avgGain /= period;
  avgLoss /= period;
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

function buildSignals(candles: Candle[]): {
  bias: "BUY" | "SELL" | "WAIT";
  biasReason: string;
  last: ScalpSignal | null;
  recent: ScalpSignal[];
  price: number;
} {
  const closes = candles.map((c) => c.close);
  const fast = ema(closes, 9);
  const slow = ema(closes, 21);
  const r = rsi(closes, 7);
  const recent: ScalpSignal[] = [];

  for (let i = 25; i < candles.length; i++) {
    const crossUp = fast[i - 1] <= slow[i - 1] && fast[i] > slow[i];
    const crossDn = fast[i - 1] >= slow[i - 1] && fast[i] < slow[i];
    const rsiUp = r[i - 1] < 35 && r[i] >= 35;
    const rsiDn = r[i - 1] > 65 && r[i] <= 65;

    if (crossUp || (fast[i] > slow[i] && rsiUp)) {
      recent.push({
        id: `buy-${candles[i].time}`,
        time: new Date(candles[i].time * 1000).toISOString(),
        side: "BUY",
        price: candles[i].close,
        strength: crossUp && rsiUp ? "solid" : "soft",
        reason: crossUp
          ? "EMA9 crossed above EMA21 on M1"
          : "Bullish EMA stack + RSI lift from oversold",
      });
    } else if (crossDn || (fast[i] < slow[i] && rsiDn)) {
      recent.push({
        id: `sell-${candles[i].time}`,
        time: new Date(candles[i].time * 1000).toISOString(),
        side: "SELL",
        price: candles[i].close,
        strength: crossDn && rsiDn ? "solid" : "soft",
        reason: crossDn
          ? "EMA9 crossed below EMA21 on M1"
          : "Bearish EMA stack + RSI roll from overbought",
      });
    }
  }

  const lastFew = recent.slice(-8).reverse();
  const last = lastFew[0] ?? null;
  const i = closes.length - 1;
  let bias: "BUY" | "SELL" | "WAIT" = "WAIT";
  let biasReason = "No clean scalp edge — wait for EMA/RSI alignment.";

  if (fast[i] > slow[i] && r[i] > 45 && r[i] < 70) {
    bias = "BUY";
    biasReason = "M1 bullish stack; look for quick longs on tiny dips.";
  } else if (fast[i] < slow[i] && r[i] < 55 && r[i] > 30) {
    bias = "SELL";
    biasReason = "M1 bearish stack; look for quick shorts on tiny pops.";
  }

  return {
    bias,
    biasReason,
    last,
    recent: lastFew,
    price: closes[i],
  };
}

async function fetchCandles(): Promise<Candle[]> {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1m&range=1d";
  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 LJCircleScalp/1.0",
    },
  });
  if (!res.ok) throw new Error(`Candle upstream ${res.status}`);

  const data = (await res.json()) as {
    chart?: {
      result?: Array<{
        timestamp?: number[];
        indicators?: {
          quote?: Array<{
            open?: Array<number | null>;
            high?: Array<number | null>;
            low?: Array<number | null>;
            close?: Array<number | null>;
          }>;
        };
      }>;
    };
  };

  const result = data.chart?.result?.[0];
  const ts = result?.timestamp || [];
  const q = result?.indicators?.quote?.[0];
  if (!q || !ts.length) throw new Error("No candle data");

  const candles: Candle[] = [];
  for (let i = 0; i < ts.length; i++) {
    const open = q.open?.[i];
    const high = q.high?.[i];
    const low = q.low?.[i];
    const close = q.close?.[i];
    if (
      open == null ||
      high == null ||
      low == null ||
      close == null ||
      !Number.isFinite(close)
    ) {
      continue;
    }
    candles.push({ time: ts[i], open, high, low, close });
  }
  if (candles.length < 40) throw new Error("Not enough candles");
  return candles;
}

export async function GET() {
  const cached = globalThis.__dreamtradesScalpCache;
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return NextResponse.json(cached.payload, {
      headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20" },
    });
  }

  try {
    const candles = await fetchCandles();
    const signal = buildSignals(candles);
    const payload = {
      ok: true,
      symbol: "XAUUSD",
      source: "GC=F M1 (proxy)",
      disclaimer:
        "Scalping signals are algorithmic and educational — not financial advice. Gold futures proxy may differ from your broker XAUUSD quotes.",
      updatedAt: new Date().toISOString(),
      ...signal,
    };
    globalThis.__dreamtradesScalpCache = { at: Date.now(), payload };
    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20" },
    });
  } catch (error) {
    if (cached) return NextResponse.json(cached.payload);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Scalp feed failed",
      },
      { status: 502 },
    );
  }
}
