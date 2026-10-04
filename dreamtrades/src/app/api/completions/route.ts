import { NextResponse } from "next/server";
import {
  formatCompletionTelegramMessage,
  newCompletionId,
  validateCompletionInput,
  type CompletionRecord,
} from "@/lib/completions";
import { listCompletions, saveCompletion } from "@/lib/completions-store";
import { notifyOwnerTelegram, telegramEnvConfigured } from "@/lib/telegram-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) return false;
  const url = new URL(request.url);
  const key = url.searchParams.get("key")?.trim();
  return Boolean(key && key === secret);
}

/** Admin list: GET /api/completions?key=ADMIN_SECRET */
export async function GET(request: Request) {
  if (!adminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await listCompletions(100);
    return NextResponse.json({
      count: data.count,
      durable: data.durable,
      items: data.items,
      telegramConfigured: telegramEnvConfigured(),
      redisConfigured: data.durable,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list completions" },
      { status: 500 },
    );
  }
}

/** Client claim: POST /api/completions */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = validateCompletionInput(
    (body && typeof body === "object" ? body : {}) as Record<string, unknown>,
  );
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (!telegramEnvConfigured()) {
    return NextResponse.json(
      {
        error:
          "Completions are not live yet. Owner must set TELEGRAM_BOT_TOKEN and TELEGRAM_OWNER_CHAT_ID.",
      },
      { status: 503 },
    );
  }

  const record: CompletionRecord = {
    id: newCompletionId(),
    ...parsed.value,
    createdAt: new Date().toISOString(),
  };

  let saved: Awaited<ReturnType<typeof saveCompletion>>;
  try {
    saved = await saveCompletion(record);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save completion" },
      { status: 500 },
    );
  }

  const message = formatCompletionTelegramMessage(record, saved.count);
  const notify = await notifyOwnerTelegram(message);
  if (!notify.ok) {
    return NextResponse.json(
      { error: notify.error },
      { status: notify.status || 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "You’re counted — we’ll reach out.",
    count: saved.count,
    durable: saved.durable,
    id: record.id,
  });
}
