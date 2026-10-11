import { NextResponse } from "next/server";
import { completionsAccepting } from "@/lib/completions-accepting";
import { formatWebsiteLeadTelegram, validateWebsiteSignup } from "@/lib/crm";
import { createCrmLead, markCrmLeadNotify } from "@/lib/crm-store";
import { notifyOwnerTelegram, telegramEnvConfigured } from "@/lib/telegram-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public homepage signup. Stores a New lead and notifies the DreamTrades owner. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = validateWebsiteSignup(
    (body && typeof body === "object" ? body : {}) as Record<string, unknown>,
  );
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (!completionsAccepting()) {
    return NextResponse.json(
      {
        error:
          "The desk is not live yet. In Vercel set TELEGRAM_BOT_TOKEN + TELEGRAM_OWNER_CHAT_ID and/or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN, then Redeploy.",
      },
      { status: 503 },
    );
  }

  let saved: Awaited<ReturnType<typeof createCrmLead>>;
  try {
    saved = await createCrmLead(
      {
        ...parsed.value,
        notified: false,
        notifyError: null,
      },
      { dedupe: true },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save lead" },
      { status: 500 },
    );
  }

  if (!saved.created) {
    return NextResponse.json({
      ok: true,
      created: false,
      message: "You’re already on the DreamTrades list. The team will reach out by hand.",
    });
  }

  let notified = false;
  let notifyError: string | null = null;
  if (telegramEnvConfigured()) {
    const notify = await notifyOwnerTelegram(formatWebsiteLeadTelegram(saved.lead));
    notified = notify.ok;
    if (!notify.ok) {
      notifyError = notify.error;
      console.error(`[leads] Lead ${saved.lead.id} saved but Telegram notify failed:`, notify.error);
    }
  } else {
    notifyError =
      "Telegram notify skipped — set TELEGRAM_BOT_TOKEN and TELEGRAM_OWNER_CHAT_ID in Vercel, then Redeploy.";
    console.warn(`[leads] Lead ${saved.lead.id} saved without Telegram notify:`, notifyError);
  }

  await markCrmLeadNotify(saved.lead.id, notified, notifyError);

  return NextResponse.json({
    ok: true,
    created: true,
    id: saved.lead.id,
    message: "Saved. The DreamTrades team will reach out by hand — nothing is sent to you automatically.",
  });
}
