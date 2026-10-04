/**
 * Sends a plain-text DM to the DreamTrades owner via Telegram Bot API.
 * Uses TELEGRAM_BOT_TOKEN + TELEGRAM_OWNER_CHAT_ID (server-only env).
 */

export type TelegramNotifyResult =
  | { ok: true }
  | { ok: false; error: string; status?: number };

export function telegramEnvConfigured(): boolean {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN?.trim() &&
      process.env.TELEGRAM_OWNER_CHAT_ID?.trim(),
  );
}

export async function notifyOwnerTelegram(text: string): Promise<TelegramNotifyResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_OWNER_CHAT_ID?.trim();

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
