import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type GoldApiResponse = {
  currency?: string;
  name?: string;
  price?: number;
  symbol?: string;
  updatedAt?: string;
};

type CacheEntry = {
  at: number;
  payload: {
    ok: true;
    symbol: string;
    name: string;
    price: number;
    currency: string;
    updatedAt: string;
  };
};

declare global {
  // eslint-disable-next-line no-var
  var __dreamtradesXauCache: CacheEntry | undefined;
}

const CACHE_MS = 2500;

export async function GET() {
  const cached = globalThis.__dreamtradesXauCache;
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return NextResponse.json(cached.payload, {
      headers: {
        "Cache-Control": "public, s-maxage=2, stale-while-revalidate=8",
      },
    });
  }

  try {
    const res = await fetch("https://api.gold-api.com/price/XAU", {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      if (cached) {
        return NextResponse.json(cached.payload);
      }
      return NextResponse.json(
        { ok: false, error: `Upstream ${res.status}` },
        { status: 502 },
      );
    }

    const data = (await res.json()) as GoldApiResponse;
    if (typeof data.price !== "number") {
      return NextResponse.json(
        { ok: false, error: "Invalid upstream payload" },
        { status: 502 },
      );
    }

    const payload = {
      ok: true as const,
      symbol: "XAUUSD",
      name: data.name || "Gold",
      price: data.price,
      currency: data.currency || "USD",
      updatedAt: data.updatedAt || new Date().toISOString(),
    };

    globalThis.__dreamtradesXauCache = { at: Date.now(), payload };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=2, stale-while-revalidate=8",
      },
    });
  } catch (error) {
    if (cached) {
      return NextResponse.json(cached.payload);
    }
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to load XAUUSD",
      },
      { status: 502 },
    );
  }
}
