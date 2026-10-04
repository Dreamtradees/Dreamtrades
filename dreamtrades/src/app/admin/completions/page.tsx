import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { CompletionRecord } from "@/lib/completions";
import { listCompletions, redisConfigured } from "@/lib/completions-store";
import { telegramEnvConfigured } from "@/lib/telegram-notify";
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
  const redisOk = redisConfigured();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mark">Admin</p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Checklist graduates
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          Private list for {BRAND_NAME}. Open with{" "}
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
            <SetupHints telegramOk={telegramOk} redisOk={redisOk} />
          </div>
        ) : (
          <div className="mt-8 space-y-6" data-testid="admin-completions">
            <div className="rounded-md border border-mark/35 bg-[color-mix(in_srgb,#0f9f8a_10%,white)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
                Total graduates
              </p>
              <p className="mt-2 font-heading text-4xl font-bold tracking-tight text-ink">
                {count}
              </p>
              <p className="mt-2 text-sm text-ink/60">
                {durable
                  ? "Count is durable (Upstash Redis)."
                  : "Count is in-memory only — set Upstash env vars for a lasting total. Each completion still DMs you on Telegram."}
              </p>
            </div>

            <SetupHints telegramOk={telegramOk} redisOk={redisOk} />

            {loadError ? (
              <p className="text-sm font-medium text-flare" role="alert">
                {loadError}
              </p>
            ) : items.length === 0 ? (
              <div className="rounded-md border border-ink/10 bg-white/70 p-5">
                <p className="font-heading text-base font-semibold text-ink">No claims yet</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  When someone finishes the checklist and submits the form, you’ll get a Telegram DM
                  with their contact — and they’ll show up here if Redis (or this process memory) is
                  available.
                </p>
                {!durable && (
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">
                    Without Redis, treat Telegram as your organised inbox for each graduate.
                  </p>
                )}
              </div>
            ) : (
              <ul className="space-y-3" data-testid="admin-completion-list">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-md border border-ink/10 bg-white/75 p-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-heading text-base font-semibold text-ink">
                        {item.name || "Unnamed graduate"}
                      </p>
                      <p className="font-mono text-[11px] text-ink/45">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
                          Telegram
                        </dt>
                        <dd className="mt-0.5 text-ink/80">{item.telegram || "—"}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
                          WhatsApp
                        </dt>
                        <dd className="mt-0.5 text-ink/80">{item.whatsapp || "—"}</dd>
                      </div>
                    </dl>
                    {item.note ? (
                      <p className="mt-3 border-t border-ink/10 pt-3 text-sm leading-relaxed text-ink/65">
                        {item.note}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
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
  redisOk,
}: {
  telegramOk: boolean;
  redisOk: boolean;
}) {
  return (
    <div className="rounded-md border border-ink/10 bg-white/60 p-4 text-sm leading-relaxed text-ink/65">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">Setup</p>
      <ul className="mt-2 space-y-1.5">
        <li>
          Telegram notify:{" "}
          <span className={telegramOk ? "font-medium text-mark" : "font-medium text-flare"}>
            {telegramOk ? "configured" : "missing TELEGRAM_BOT_TOKEN / TELEGRAM_OWNER_CHAT_ID"}
          </span>
        </li>
        <li>
          Durable count/list:{" "}
          <span className={redisOk ? "font-medium text-mark" : "font-medium text-ink/55"}>
            {redisOk
              ? "Upstash Redis connected"
              : "optional — add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN"}
          </span>
        </li>
      </ul>
    </div>
  );
}
