import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { CompletionRecord } from "@/lib/completions";
import {
  listCompletions,
  localFileStoreActive,
  redisConfigured,
  type StoreBackend,
} from "@/lib/completions-store";
import {
  telegramBotConfigured,
  telegramEnvConfigured,
  telegramNotifyMock,
} from "@/lib/telegram-notify";
import { affiliateDisplayName } from "@/lib/affiliates";
import {
  adminAccessAuthorized,
  filterLeadsForTeamAdmin,
  teamAdminActorSlug,
} from "@/lib/admin-auth";
import { BRAND_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ key?: string; ref?: string }>;
};

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function backendLabel(backend: StoreBackend, durable: boolean): string {
  if (backend === "redis") return "Durable count (Upstash Redis).";
  if (backend === "file") return "Local file store (.data/completions.json) — fine for dev; use Upstash on Vercel.";
  return durable
    ? "Stored locally."
    : "In-memory only — will reset on restart / cold start. Add Upstash on Vercel.";
}

function notifyLabel(item: CompletionRecord): { text: string; ok: boolean | null } {
  if (item.notified === true) return { text: "DM sent", ok: true };
  if (item.notifyError) return { text: "DM failed", ok: false };
  if (item.notified === false) return { text: "Pending / skipped", ok: false };
  return { text: "—", ok: null };
}

export default async function AdminCompletionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const key = params.key?.trim();
  const refFilter = (params.ref || "").trim().toLowerCase();
  const authorized = adminAccessAuthorized(key);
  const teamActor = authorized ? teamAdminActorSlug(key) : null;
  const teamActorName = teamActor ? affiliateDisplayName(teamActor) : null;

  let items: CompletionRecord[] = [];
  let count = 0;
  let durable = false;
  let backend: StoreBackend = "memory";
  let loadError: string | null = null;
  let affiliateLeadCount = 0;

  if (authorized) {
    try {
      const data = await listCompletions(200);
      durable = data.durable;
      backend = data.backend;
      items = filterLeadsForTeamAdmin(data.items, teamActor);
      // Owner sees platform total; team admin sees only their visible book
      count = teamActor ? items.length : data.count;
      if (refFilter) {
        items = items.filter((item) => (item.ref || "") === refFilter);
        affiliateLeadCount = items.length;
        if (teamActor) count = items.length;
      }
    } catch (err) {
      loadError = err instanceof Error ? err.message : "Failed to load completions";
    }
  }

  const telegramOk = telegramEnvConfigured();
  const telegramBotOk = telegramBotConfigured();
  const telegramMock = telegramNotifyMock();
  const redisOk = redisConfigured();
  const fileOk = localFileStoreActive();
  const setupPath = key
    ? `/api/completions/telegram-setup?key=${encodeURIComponent(key)}`
    : null;
  const adminSecretSet = Boolean(process.env.ADMIN_SECRET?.trim());

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mark">Admin</p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {teamActorName ? `${teamActorName} — your leads` : "Checklist graduates"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
          {teamActorName ? (
            <>
              Your leads only — graduates who came through your {teamActorName} link. Owner /
              DreamTrades checklist clients never appear here.
            </>
          ) : (
            <>
              Private lead list for {BRAND_NAME}. Open with{" "}
              <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[12px]">
                /admin/completions?key=YOUR_ADMIN_SECRET
              </code>
              .
            </>
          )}
        </p>

        {!authorized ? (
          <div
            className="mt-8 rounded-md border border-flare/30 bg-[color-mix(in_srgb,#e85d4c_8%,white)] p-5"
            data-testid="admin-unauthorized"
          >
            <p className="font-heading text-lg font-semibold text-ink">Unauthorized</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              Add a valid <span className="font-mono text-[12px]">?key=</span> that matches{" "}
              <span className="font-mono text-[12px]">ADMIN_SECRET</span> in Vercel env.
              {!adminSecretSet ? (
                <>
                  {" "}
                  <span className="font-medium text-flare">
                    ADMIN_SECRET is not set on this deployment yet.
                  </span>
                </>
              ) : null}
            </p>
            <SetupHints
              telegramOk={telegramOk}
              telegramBotOk={telegramBotOk}
              telegramMock={telegramMock}
              redisOk={redisOk}
              fileOk={fileOk}
              adminSecretSet={adminSecretSet}
              setupPath={null}
            />
          </div>
        ) : (
          <div className="mt-8 space-y-6" data-testid="admin-completions">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-md border border-mark/35 bg-[color-mix(in_srgb,#0f9f8a_10%,white)] p-5 sm:col-span-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
                  Total graduates
                </p>
                <p
                  className="mt-2 font-heading text-4xl font-bold tracking-tight text-ink"
                  data-testid="admin-total-count"
                >
                  {count}
                </p>
                <p className="mt-2 text-sm text-ink/60">{backendLabel(backend, durable)}</p>
                {refFilter ? (
                  <p className="mt-2 text-sm font-medium text-ink">
                    Showing {affiliateLeadCount} for{" "}
                    <span className="font-mono text-mark">ref={refFilter}</span>
                  </p>
                ) : null}
              </div>
              <div className="rounded-md border border-ink/10 bg-white/70 p-5 sm:col-span-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">
                  Affiliates + notifications
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  Each claim stores name, Telegram, WhatsApp, affiliate <span className="font-mono text-[12px]">ref</span>, and timestamp, then DMs you on Telegram. Filter this table with{" "}
                  <span className="font-mono text-[12px]">&amp;ref=sara</span>. Partner share links:{" "}
                  <span className="font-mono text-[12px]">/with/SLUG</span> · their CRM:{" "}
                  <span className="font-mono text-[12px]">/partners/SLUG?key=…</span>
                </p>
                {key ? (
                  <p className="mt-3 text-xs text-ink/50">
                    Example filter:{" "}
                    <Link
                      href={`/admin/completions?key=${encodeURIComponent(key)}&ref=sara`}
                      className="font-mono text-mark underline-offset-2 hover:underline"
                    >
                      ?key=…&amp;ref=sara
                    </Link>
                    {refFilter ? (
                      <>
                        {" · "}
                        <Link
                          href={`/admin/completions?key=${encodeURIComponent(key)}`}
                          className="text-mark underline-offset-2 hover:underline"
                        >
                          Clear filter
                        </Link>
                      </>
                    ) : null}
                  </p>
                ) : null}
              </div>
            </div>

            <SetupHints
              telegramOk={telegramOk}
              telegramBotOk={telegramBotOk}
              telegramMock={telegramMock}
              redisOk={redisOk}
              fileOk={fileOk}
              adminSecretSet={adminSecretSet}
              setupPath={setupPath}
            />

            {loadError ? (
              <p className="text-sm font-medium text-flare" role="alert">
                {loadError}
              </p>
            ) : items.length === 0 ? (
              <div className="rounded-md border border-ink/10 bg-white/70 p-5">
                <p className="font-heading text-base font-semibold text-ink">No claims yet</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  When someone finishes the checklist and submits “Count me in”, their lead appears
                  here (durable with Upstash) and you get a Telegram DM.
                </p>
              </div>
            ) : (
              <div
                className="overflow-x-auto rounded-md border border-ink/10 bg-white/80"
                data-testid="admin-completion-list"
              >
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="bg-ink/[0.03]">
                    <tr className="border-b border-ink/10 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
                      <th className="px-4 py-3 font-medium"># / When</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Affiliate</th>
                      <th className="px-4 py-3 font-medium">Telegram</th>
                      <th className="px-4 py-3 font-medium">WhatsApp</th>
                      <th className="px-4 py-3 font-medium">Note</th>
                      <th className="px-4 py-3 font-medium">Notify</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const displayNum =
                        count > 0 ? Math.max(count - index, 1) : items.length - index;
                      const notify = notifyLabel(item);
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-ink/8 align-top last:border-b-0"
                          data-testid="admin-lead-row"
                        >
                          <td className="whitespace-nowrap px-4 py-3">
                            <p className="font-heading font-semibold text-ink">#{displayNum}</p>
                            <p className="mt-0.5 font-mono text-[11px] text-ink/45">
                              {formatWhen(item.createdAt)}
                            </p>
                          </td>
                          <td className="px-4 py-3 font-medium text-ink">
                            {item.name || "—"}
                          </td>
                          <td className="px-4 py-3 font-mono text-[12px] text-ink/70">
                            {item.ref ? item.ref : "organic"}
                          </td>
                          <td className="px-4 py-3 text-ink/80">{item.telegram || "—"}</td>
                          <td className="px-4 py-3 text-ink/80">{item.whatsapp || "—"}</td>
                          <td className="max-w-[200px] px-4 py-3 text-ink/65">
                            {item.note || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <p
                              className={
                                notify.ok === true
                                  ? "font-medium text-mark"
                                  : notify.ok === false
                                    ? "font-medium text-flare"
                                    : "text-ink/45"
                              }
                            >
                              {notify.text}
                            </p>
                            {item.notifyError ? (
                              <p className="mt-1 max-w-[180px] font-mono text-[10px] leading-snug text-ink/45">
                                {item.notifyError}
                              </p>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <p className="mt-10 text-sm text-ink/50">
          <Link href="/learn" className="text-mark underline-offset-2 hover:underline">
            ← Back to Learn
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

function SetupHints({
  telegramOk,
  telegramBotOk,
  telegramMock,
  redisOk,
  fileOk,
  adminSecretSet,
  setupPath,
}: {
  telegramOk: boolean;
  telegramBotOk: boolean;
  telegramMock: boolean;
  redisOk: boolean;
  fileOk: boolean;
  adminSecretSet: boolean;
  setupPath: string | null;
}) {
  return (
    <div className="rounded-md border border-ink/10 bg-white/60 p-4 text-sm leading-relaxed text-ink/65">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">Setup</p>
      <ul className="mt-2 space-y-1.5">
        <li>
          ADMIN_SECRET:{" "}
          <span className={adminSecretSet ? "font-medium text-mark" : "font-medium text-flare"}>
            {adminSecretSet ? "set" : "missing — admin page / setup helpers locked"}
          </span>
        </li>
        <li>
          Telegram notify:{" "}
          <span className={telegramOk ? "font-medium text-mark" : "font-medium text-flare"}>
            {telegramMock
              ? "MOCK mode (TELEGRAM_NOTIFY_MOCK=1) — server logs only"
              : telegramOk
                ? "configured"
                : telegramBotOk
                  ? "bot token set — missing TELEGRAM_OWNER_CHAT_ID"
                  : "missing TELEGRAM_BOT_TOKEN / TELEGRAM_OWNER_CHAT_ID"}
          </span>
        </li>
        <li>
          Durable leads:{" "}
          <span
            className={
              redisOk ? "font-medium text-mark" : fileOk ? "font-medium text-ink/70" : "font-medium text-ink/55"
            }
          >
            {redisOk
              ? "Upstash Redis connected"
              : fileOk
                ? "local file store (dev) — add UPSTASH_REDIS_REST_URL + TOKEN on Vercel"
                : "add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or Vercel KV aliases)"}
          </span>
        </li>
      </ul>
      {setupPath ? (
        <div className="mt-3 space-y-1 border-t border-ink/10 pt-3 text-xs text-ink/55">
          <p>
            Discover chat id (after you message the bot):{" "}
            <a href={setupPath} className="font-mono text-mark underline-offset-2 hover:underline">
              GET {setupPath}
            </a>
          </p>
          <p>
            Send test DM:{" "}
            <span className="font-mono">POST {setupPath}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
