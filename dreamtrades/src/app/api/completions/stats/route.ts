import { NextResponse } from "next/server";
import { completionsAccepting } from "@/lib/completions-accepting";
import {
  getCompletionStats,
  localFileStoreActive,
  redisConfigured,
} from "@/lib/completions-store";
import {
  telegramBotConfigured,
  telegramEnvConfigured,
  telegramNotifyMock,
} from "@/lib/telegram-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public graduate count (no PII). */
export async function GET() {
  try {
    const stats = await getCompletionStats();
    return NextResponse.json({
      count: stats.count,
      durable: stats.durable,
      backend: stats.backend,
      telegramConfigured: telegramEnvConfigured(),
      telegramBotConfigured: telegramBotConfigured(),
      telegramMock: telegramNotifyMock(),
      redisConfigured: redisConfigured(),
      fileStore: localFileStoreActive(),
      accepting: completionsAccepting(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to read stats" },
      { status: 500 },
    );
  }
}
