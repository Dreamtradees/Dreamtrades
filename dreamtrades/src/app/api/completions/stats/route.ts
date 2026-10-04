import { NextResponse } from "next/server";
import { getCompletionStats, redisConfigured } from "@/lib/completions-store";
import { telegramEnvConfigured } from "@/lib/telegram-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public graduate count (no PII). */
export async function GET() {
  try {
    const stats = await getCompletionStats();
    return NextResponse.json({
      count: stats.count,
      durable: stats.durable,
      telegramConfigured: telegramEnvConfigured(),
      redisConfigured: redisConfigured(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to read stats" },
      { status: 500 },
    );
  }
}
