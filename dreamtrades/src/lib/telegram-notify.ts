/**
 * Sends a plain-text DM to the DreamTrades owner via Telegram Bot API.
 * Uses TELEGRAM_BOT_TOKEN + TELEGRAM_OWNER_CHAT_ID (server-only env).
 */

export type TelegramNotifyResult =
  | { ok: true }
  | { ok: false; error: string; status?: number };

export function telegramBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
}

export function telegramOwnerChatId(): string {
  return process.env.TELEGRAM_OWNER_CHAT_ID?.trim() || "";
}

export function telegramEnvConfigured(): boolean {
  return Boolean(telegramBotToken() && telegramOwnerChatId());
}

export function telegramBotConfigured(): boolean {
  return Boolean(telegramBotToken());
}

export async function notifyOwnerTelegram(text: string): Promise<TelegramNotifyResult> {
  const token = telegramBotToken();
  const chatId = telegramOwnerChatId();

  if (!token || !chatId) {
    return {
      ok: false,
      error:
        "Telegram notify is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_OWNER_CHAT_ID in Vercel.",
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
      return {
        ok: false,
        error: body?.description || `Telegram API error (${res.status})`,
        status: 502,
      };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to reach Telegram",
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
