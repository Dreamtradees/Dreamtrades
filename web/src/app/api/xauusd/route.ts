import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type GoldApiResponse = {
  currency?: string;
  name?: string;
  price?: number;
  symbol?: string;
  updatedAt?: string;
};

export async function GET() {
  try {
    const res = await fetch("https://api.gold-api.com/price/XAU", {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
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

    return NextResponse.json({
      ok: true,
      symbol: "XAUUSD",
      name: data.name || "Gold",
      price: data.price,
      currency: data.currency || "USD",
      updatedAt: data.updatedAt || new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to load XAUUSD",
      },
      { status: 502 },
    );
  }
}
