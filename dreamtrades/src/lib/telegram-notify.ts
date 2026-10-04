/**
 * Sends a plain-text DM to the DreamTrades owner via Telegram Bot API.
 * Uses TELEGRAM_BOT_TOKEN + TELEGRAM_OWNER_CHAT_ID (server-only env).
 *
 * TELEGRAM_NOTIFY_MOCK=1 — log the message instead of calling Telegram
 * (local/dev testing without a real bot).
 */

export type TelegramNotifyResult =
  | { ok: true; mocked?: boolean }
  | { ok: false; error: string; status?: number };

export function telegramBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
}

export function telegramOwnerChatId(): string {
  return process.env.TELEGRAM_OWNER_CHAT_ID?.trim() || "";
}

export function telegramNotifyMock(): boolean {
  return process.env.TELEGRAM_NOTIFY_MOCK === "1";
}

export function telegramEnvConfigured(): boolean {
  if (telegramNotifyMock()) return true;
  return Boolean(telegramBotToken() && telegramOwnerChatId());
}

export function telegramBotConfigured(): boolean {
  if (telegramNotifyMock()) return true;
  return Boolean(telegramBotToken());
}

export async function notifyOwnerTelegram(text: string): Promise<TelegramNotifyResult> {
  if (telegramNotifyMock()) {
    console.info("[telegram-notify] MOCK DM\n" + text);
    return { ok: true, mocked: true };
  }

  const token = telegramBotToken();
  const chatId = telegramOwnerChatId();

  if (!token && !chatId) {
    return {
      ok: false,
      error:
        "Telegram notify is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_OWNER_CHAT_ID in Vercel (Project → Settings → Environment Variables), then Redeploy.",
      status: 503,
    };
  }

  if (!token) {
    return {
      ok: false,
      error:
        "TELEGRAM_BOT_TOKEN is missing. Create a bot with @BotFather and paste the token into Vercel env.",
      status: 503,
    };
  }

  if (!chatId) {
    return {
      ok: false,
      error:
        "TELEGRAM_OWNER_CHAT_ID is missing. Message your bot, then GET /api/completions/telegram-setup?key=ADMIN_SECRET to discover your numeric chat id.",
      status: 503,
    };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      cache: "no-store",
    });

    const body = (await res.json().catch(() => null)) as
      | { ok?: boolean; description?: string }
      | null;

    if (!res.ok || !body?.ok) {
      const error = body?.description || `Telegram API error (${res.status})`;
      console.error("[telegram-notify] sendMessage failed:", error);
      return {
        ok: false,
        error,
        status: 502,
      };
    }

    return { ok: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Failed to reach Telegram";
    console.error("[telegram-notify] network error:", error);
    return {
      ok: false,
      error,
      status: 502,
    };
  }
}

export type RecentTelegramChat = {
  chatId: string;
  type: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  lastMessageAt?: number;
};

/**
 * Temporary helper: read recent chats that messaged the bot (getUpdates).
 * Owner should /start the bot first, then call the admin discover endpoint
 * to copy their numeric chat id into TELEGRAM_OWNER_CHAT_ID.
 */
export async function discoverRecentTelegramChats(
  limit = 20,
): Promise<{ ok: true; chats: RecentTelegramChat[] } | { ok: false; error: string }> {
  if (telegramNotifyMock()) {
    return {
      ok: true,
      chats: [
        {
          chatId: "000000000",
          type: "private",
          username: "mock_owner",
          firstName: "Mock",
          lastName: "Owner",
        },
      ],
    };
  }

  const token = telegramBotToken();
  if (!token) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN is not set." };
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/getUpdates?limit=100&allowed_updates=${encodeURIComponent(
        JSON.stringify(["message", "edited_message"]),
      )}`,
      { cache: "no-store" },
    );
    const body = (await res.json().catch(() => null)) as {
      ok?: boolean;
      description?: string;
      result?: Array<{
        update_id: number;
        message?: {
          date?: number;
          chat?: {
            id: number;
            type: string;
            username?: string;
            first_name?: string;
            last_name?: string;
            title?: string;
          };
        };
        edited_message?: {
          date?: number;
          chat?: {
            id: number;
            type: string;
            username?: string;
            first_name?: string;
            last_name?: string;
            title?: string;
          };
        };
      }>;
    } | null;

    if (!res.ok || !body?.ok) {
      return {
        ok: false,
        error: body?.description || `Telegram getUpdates failed (${res.status})`,
      };
    }

    const byId = new Map<string, RecentTelegramChat>();
    for (const update of body.result || []) {
      const msg = update.message || update.edited_message;
      const chat = msg?.chat;
      if (!chat) continue;
      const chatId = String(chat.id);
      const prev = byId.get(chatId);
      const lastMessageAt = msg?.date;
      if (prev && (prev.lastMessageAt || 0) >= (lastMessageAt || 0)) continue;
      byId.set(chatId, {
        chatId,
        type: chat.type,
        username: chat.username,
        firstName: chat.first_name,
        lastName: chat.last_name,
        title: chat.title,
        lastMessageAt,
      });
    }

    const chats = [...byId.values()]
      .sort((a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0))
      .slice(0, limit);

    return { ok: true, chats };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to reach Telegram",
    };
  }
}
