import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { CompletionRecord } from "@/lib/completions";
import { listCompletions, redisConfigured } from "@/lib/completions-store";
import {
  telegramBotConfigured,
  telegramEnvConfigured,
} from "@/lib/telegram-notify";
import { BRAND_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ key?: string }>;
};

function authOk(key: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret || !key) return false;
  return key === secret;
}

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

export default async function AdminCompletionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const key = params.key?.trim();
  const authorized = authOk(key);

  let items: CompletionRecord[] = [];
  let count = 0;
  let durable = false;
  let loadError: string | null = null;

  if (authorized) {
    try {
      const data = await listCompletions(100);
      items = data.items;
      count = data.count;
      durable = data.durable;
    } catch (err) {
      loadError = err instanceof Error ? err.message : "Failed to load completions";
    }
  }

  const telegramOk = telegramEnvConfigured();
  const telegramBotOk = telegramBotConfigured();
  const redisOk = redisConfigured();
  const setupPath = key
    ? `/api/completions/telegram-setup?key=${encodeURIComponent(key)}`
    : null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mark">Admin</p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Checklist graduates
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
          Private lead list for {BRAND_NAME}. Open with{" "}
          <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[12px]">
            /admin/completions?key=YOUR_ADMIN_SECRET
          </code>
          .
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
            </p>
            <SetupHints
              telegramOk={telegramOk}
              telegramBotOk={telegramBotOk}
              redisOk={redisOk}
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
                <p className="mt-2 font-heading text-4xl font-bold tracking-tight text-ink">
                  {count}
                </p>
                <p className="mt-2 text-sm text-ink/60">
                  {durable
                    ? "Durable count (Upstash Redis)."
                    : "In-memory only until Upstash is set."}
                </p>
              </div>
              <div className="rounded-md border border-ink/10 bg-white/70 p-5 sm:col-span-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">
                  How notifications arrive
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  Each successful claim stores name, Telegram, WhatsApp, note, and timestamp, then
                  DMs you on Telegram with graduate # and contact details. Open that DM (or this
                  table) and message them on Telegram or WhatsApp.
                </p>
              </div>
            </div>

            <SetupHints
              telegramOk={telegramOk}
              telegramBotOk={telegramBotOk}
              redisOk={redisOk}
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
                      <th className="px-4 py-3 font-medium">Telegram</th>
                      <th className="px-4 py-3 font-medium">WhatsApp</th>
                      <th className="px-4 py-3 font-medium">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const displayNum =
                        count > 0 ? Math.max(count - index, 1) : items.length - index;
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-ink/8 align-top last:border-b-0"
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
                          <td className="px-4 py-3 text-ink/80">{item.telegram || "—"}</td>
                          <td className="px-4 py-3 text-ink/80">{item.whatsapp || "—"}</td>
                          <td className="max-w-[220px] px-4 py-3 text-ink/65">
                            {item.note || "—"}
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
  redisOk,
  setupPath,
}: {
  telegramOk: boolean;
  telegramBotOk: boolean;
  redisOk: boolean;
  setupPath: string | null;
}) {
  return (
    <div className="rounded-md border border-ink/10 bg-white/60 p-4 text-sm leading-relaxed text-ink/65">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">Setup</p>
      <ul className="mt-2 space-y-1.5">
        <li>
          Telegram notify:{" "}
          <span className={telegramOk ? "font-medium text-mark" : "font-medium text-flare"}>
            {telegramOk
              ? "configured"
              : telegramBotOk
                ? "bot token set — missing TELEGRAM_OWNER_CHAT_ID"
                : "missing TELEGRAM_BOT_TOKEN / TELEGRAM_OWNER_CHAT_ID"}
          </span>
        </li>
        <li>
          Durable leads:{" "}
          <span className={redisOk ? "font-medium text-mark" : "font-medium text-ink/55"}>
            {redisOk
              ? "Upstash Redis connected"
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
