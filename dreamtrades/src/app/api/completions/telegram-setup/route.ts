import { NextResponse } from "next/server";
import {
  discoverRecentTelegramChats,
  notifyOwnerTelegram,
  telegramBotConfigured,
  telegramEnvConfigured,
  telegramOwnerChatId,
} from "@/lib/telegram-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) return false;
  const url = new URL(request.url);
  const key = url.searchParams.get("key")?.trim();
  return Boolean(key && key === secret);
}

/**
 * Temporary Telegram bootstrap helpers (admin-only).
 *
 * GET  /api/completions/telegram-setup?key=ADMIN_SECRET
 *   → recent chats that messaged the bot (copy your chat id into TELEGRAM_OWNER_CHAT_ID)
 *
 * POST /api/completions/telegram-setup?key=ADMIN_SECRET
 *   → send a test DM to TELEGRAM_OWNER_CHAT_ID
 */
export async function GET(request: Request) {
  if (!adminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!telegramBotConfigured()) {
    return NextResponse.json(
      {
        error: "TELEGRAM_BOT_TOKEN is not set.",
        telegramConfigured: false,
        telegramBotConfigured: false,
        ownerChatIdSet: Boolean(telegramOwnerChatId()),
      },
      { status: 503 },
    );
  }

  const discovered = await discoverRecentTelegramChats(20);
  if (!discovered.ok) {
    return NextResponse.json(
      {
        error: discovered.error,
        telegramConfigured: telegramEnvConfigured(),
        telegramBotConfigured: true,
        ownerChatIdSet: Boolean(telegramOwnerChatId()),
        hint: "Open your bot in Telegram, press Start / send any message, then refresh this endpoint.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    telegramConfigured: telegramEnvConfigured(),
    telegramBotConfigured: true,
    ownerChatIdSet: Boolean(telegramOwnerChatId()),
    ownerChatIdHint: telegramOwnerChatId() || null,
    chats: discovered.chats,
    instructions: [
      "1. Open your bot in Telegram and press Start (or send /start).",
      "2. Refresh this endpoint — your numeric chatId should appear below.",
      "3. Paste that chatId into Vercel env TELEGRAM_OWNER_CHAT_ID and redeploy.",
      "4. Or message @userinfobot and copy the Id field.",
    ],
  });
}

export async function POST(request: Request) {
  if (!adminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!telegramEnvConfigured()) {
    return NextResponse.json(
      {
        error:
          "Set TELEGRAM_BOT_TOKEN and TELEGRAM_OWNER_CHAT_ID first. Use GET on this same path to discover your chat id after messaging the bot.",
        telegramConfigured: false,
        telegramBotConfigured: telegramBotConfigured(),
      },
      { status: 503 },
    );
  }

  const result = await notifyOwnerTelegram(
    [
      "✅ DreamTrades test notification",
      "",
      "If you see this, TELEGRAM_BOT_TOKEN + TELEGRAM_OWNER_CHAT_ID are working.",
      `When: ${new Date().toISOString()}`,
    ].join("\n"),
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status || 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Test DM sent to TELEGRAM_OWNER_CHAT_ID.",
  });
}
