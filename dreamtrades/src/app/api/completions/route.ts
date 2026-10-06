import { NextResponse } from "next/server";
import {
  formatCompletionTelegramMessage,
  newCompletionId,
  validateCompletionInput,
  type CompletionRecord,
} from "@/lib/completions";
import { completionsAccepting } from "@/lib/completions-accepting";
import {
  listCompletions,
  redisConfigured,
  saveCompletion,
  updateCompletionNotifyStatus,
} from "@/lib/completions-store";
import { adminAccessAuthorized } from "@/lib/admin-auth";
import {
  notifyOwnerTelegram,
  telegramBotConfigured,
  telegramEnvConfigured,
  telegramNotifyMock,
} from "@/lib/telegram-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminAuthorized(request: Request): boolean {
  const url = new URL(request.url);
  const key = url.searchParams.get("key")?.trim();
  return adminAccessAuthorized(key);
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
      backend: data.backend,
      items: data.items,
      telegramConfigured: telegramEnvConfigured(),
      telegramBotConfigured: telegramBotConfigured(),
      telegramMock: telegramNotifyMock(),
      redisConfigured: redisConfigured(),
      accepting: completionsAccepting(),
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

  if (!completionsAccepting()) {
    return NextResponse.json(
      {
        error:
          "Completions are not live yet. In Vercel set TELEGRAM_BOT_TOKEN + TELEGRAM_OWNER_CHAT_ID (notify) and/or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (durable leads), then Redeploy.",
      },
      { status: 503 },
    );
  }

  const record: CompletionRecord = {
    id: newCompletionId(),
    ...parsed.value,
    createdAt: new Date().toISOString(),
    notified: false,
    notifyError: null,
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

  // Lead is already stored — Telegram is best-effort so a notify blip
  // never blocks the learner or causes a double-submit retry storm.
  let notified = false;
  let notifyError: string | null = null;
  if (telegramEnvConfigured()) {
    const message = formatCompletionTelegramMessage(record, saved.count);
    const notify = await notifyOwnerTelegram(message);
    notified = notify.ok;
    if (!notify.ok) {
      notifyError = notify.error;
      console.error(
        `[completions] Lead ${record.id} saved (count=${saved.count}, backend=${saved.backend}) but Telegram notify failed:`,
        notify.error,
      );
    }
  } else {
    notifyError =
      "Telegram notify skipped — set TELEGRAM_BOT_TOKEN and TELEGRAM_OWNER_CHAT_ID in Vercel, then Redeploy.";
    console.warn(
      `[completions] Lead ${record.id} saved (count=${saved.count}, backend=${saved.backend}) without Telegram notify:`,
      notifyError,
    );
  }

  await updateCompletionNotifyStatus(record.id, notified, notifyError);

  return NextResponse.json({
    ok: true,
    message: "You’re counted — we’ll reach out on Telegram and WhatsApp.",
    count: saved.count,
    durable: saved.durable,
    backend: saved.backend,
    notified,
    notifyError,
    id: record.id,
  });
}
