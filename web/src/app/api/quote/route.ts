import { NextRequest, NextResponse } from "next/server";
import { getMarket, type MarketId } from "@/lib/markets";

export const dynamic = "force-dynamic";

type CacheEntry = {
  at: number;
  payload: Record<string, unknown>;
};

declare global {
  // eslint-disable-next-line no-var
  var __dreamtradesQuoteCache: Record<string, CacheEntry> | undefined;
}

const CACHE_MS = 2500;

function cacheGet(key: string) {
  return globalThis.__dreamtradesQuoteCache?.[key];
}

function cacheSet(key: string, payload: Record<string, unknown>) {
  if (!globalThis.__dreamtradesQuoteCache) {
    globalThis.__dreamtradesQuoteCache = {};
  }
  globalThis.__dreamtradesQuoteCache[key] = { at: Date.now(), payload };
}

async function fetchGold() {
  const res = await fetch("https://api.gold-api.com/price/XAU", {
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Gold upstream ${res.status}`);
  const data = (await res.json()) as { price?: number; name?: string; updatedAt?: string };
  if (typeof data.price !== "number") throw new Error("Invalid gold payload");
  return {
    ok: true as const,
    symbol: "XAUUSD" as MarketId,
    name: data.name || "Gold",
    price: data.price,
    currency: "USD",
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

async function fetchForexBasket() {
  const res = await fetch("https://open.er-api.com/v6/latest/USD", {
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`FX upstream ${res.status}`);
  const data = (await res.json()) as {
    result?: string;
    rates?: Record<string, number>;
    time_last_update_utc?: string;
  };
  if (data.result !== "success" || !data.rates) {
    throw new Error("Invalid FX payload");
  }

  const r = data.rates;
  const updatedAt = data.time_last_update_utc
    ? new Date(data.time_last_update_utc).toISOString()
    : new Date().toISOString();

  const pairs: Record<string, number> = {
    EURUSD: 1 / r.EUR,
    GBPUSD: 1 / r.GBP,
    USDJPY: r.JPY,
    AUDUSD: 1 / r.AUD,
    USDCAD: r.CAD,
    USDCHF: r.CHF,
    NZDUSD: 1 / r.NZD,
  };

  return { pairs, updatedAt };
}

export async function GET(req: NextRequest) {
  const symbol = (req.nextUrl.searchParams.get("symbol") || "XAUUSD").toUpperCase();
  const market = getMarket(symbol);
  const cacheKey = market.id;

  const cached = cacheGet(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return NextResponse.json(cached.payload, {
      headers: { "Cache-Control": "public, s-maxage=2, stale-while-revalidate=8" },
    });
  }

  try {
    if (market.kind === "metal") {
      const payload = await fetchGold();
      cacheSet(cacheKey, payload);
      return NextResponse.json(payload, {
        headers: { "Cache-Control": "public, s-maxage=2, stale-while-revalidate=8" },
      });
    }

    // One FX basket fetch can hydrate every forex symbol cache.
    const basketKey = "FX_BASKET";
    const basketCached = cacheGet(basketKey);
    let pairs: Record<string, number>;
    let updatedAt: string;

    if (basketCached && Date.now() - basketCached.at < CACHE_MS) {
      pairs = basketCached.payload.pairs as Record<string, number>;
      updatedAt = basketCached.payload.updatedAt as string;
    } else {
      const basket = await fetchForexBasket();
      pairs = basket.pairs;
      updatedAt = basket.updatedAt;
      cacheSet(basketKey, { pairs, updatedAt });
      for (const [id, price] of Object.entries(pairs)) {
        const m = getMarket(id);
        cacheSet(id, {
          ok: true,
          symbol: id,
          name: m.name,
          price,
          currency: "USD",
          updatedAt,
        });
      }
    }

    const price = pairs[market.id];
    if (typeof price !== "number") {
      return NextResponse.json(
        { ok: false, error: `Unsupported symbol ${market.id}` },
        { status: 400 },
      );
    }

    const payload = {
      ok: true as const,
      symbol: market.id,
      name: market.name,
      price,
      currency: "USD",
      updatedAt,
    };
    cacheSet(cacheKey, payload);
    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=2, stale-while-revalidate=8" },
    });
  } catch (error) {
    if (cached) return NextResponse.json(cached.payload);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to load quote",
      },
      { status: 502 },
    );
  }
}
