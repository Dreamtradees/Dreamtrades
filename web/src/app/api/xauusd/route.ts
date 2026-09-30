import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Back-compat alias — prefer /api/quote?symbol=XAUUSD */
export async function GET() {
  try {
    const res = await fetch("https://api.gold-api.com/price/XAU", {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Upstream ${res.status}` }, { status: 502 });
    }
    const data = (await res.json()) as {
      price?: number;
      name?: string;
      updatedAt?: string;
    };
    if (typeof data.price !== "number") {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 502 });
    }
    return NextResponse.json({
      ok: true,
      symbol: "XAUUSD",
      name: data.name || "Gold",
      price: data.price,
      currency: "USD",
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
