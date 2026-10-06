import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  affiliateDisplayName,
  affiliatePortalAuthorized,
  getAffiliate,
  normalizeAffiliateSlug,
} from "@/lib/affiliates";
import type { CompletionRecord } from "@/lib/completions";
import { listCompletions } from "@/lib/completions-store";
import { BRAND_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = normalizeAffiliateSlug(raw);
  const name = slug ? affiliateDisplayName(slug) : "Partner";
  return { title: `${name} leads — ${BRAND_NAME}` };
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

/**
 * Partner mini-CRM — only leads tagged with this affiliate slug.
 * Auth: AFFILIATE_<SLUG>_SECRET or ADMIN_SECRET via ?key=
 */
export default async function PartnerPortalPage({ params, searchParams }: PageProps) {
  const { slug: raw } = await params;
  const slug = normalizeAffiliateSlug(raw);
  if (!slug) notFound();

  const { key } = await searchParams;
  const authorized = affiliatePortalAuthorized(slug, key);
  const name = affiliateDisplayName(slug);
  const registered = Boolean(getAffiliate(slug));
  const sharePath = `/with/${encodeURIComponent(slug)}`;

  let items: CompletionRecord[] = [];
  let loadError: string | null = null;

  if (authorized) {
    try {
      const data = await listCompletions(200);
      items = data.items.filter((item) => (item.ref || "") === slug);
    } catch (err) {
      loadError = err instanceof Error ? err.message : "Failed to load leads";
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mark">Partner portal</p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
          Your DreamTrades leads only. Share{" "}
          <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[12px]">{sharePath}</code>{" "}
          — every graduate who came through that link shows up here.
        </p>

        {!authorized ? (
          <div
            className="mt-8 rounded-md border border-flare/30 bg-[color-mix(in_srgb,#e85d4c_8%,white)] p-5"
            data-testid="partner-unauthorized"
          >
            <p className="font-heading text-lg font-semibold text-ink">Unauthorized</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              Open with{" "}
              <span className="font-mono text-[12px]">
                /partners/{slug}?key=YOUR_AFFILIATE_SECRET
              </span>
              . Owner can use ADMIN_SECRET while testing. Set{" "}
              <span className="font-mono text-[12px]">
                AFFILIATE_{slug.replace(/-/g, "_").toUpperCase()}_SECRET
              </span>{" "}
              on Vercel for her private key.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6" data-testid="partner-portal">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-md border border-mark/35 bg-[color-mix(in_srgb,#0f9f8a_10%,white)] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
                  Your graduates
                </p>
                <p
                  className="mt-2 font-heading text-4xl font-bold tracking-tight text-ink"
                  data-testid="partner-lead-count"
                >
                  {items.length}
                </p>
                <p className="mt-2 text-sm text-ink/60">
                  {registered ? "Registered partner" : "Code active (add to affiliates.ts for display name)"}
                </p>
              </div>
              <div className="rounded-md border border-ink/10 bg-white/70 p-5 sm:col-span-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">
                  Your share link
                </p>
                <p className="mt-2 break-all font-mono text-sm text-ink">
                  https://dreamtrades.vercel.app{sharePath}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  Post this in her bio / stories / WhatsApp. When someone finishes the checklist and
                  claims, they count toward her total and land in this table (Telegram + WhatsApp).
                </p>
                <Link
                  href={sharePath}
                  className="mt-3 inline-block text-sm font-medium text-mark underline-offset-2 hover:underline"
                >
                  Open landing →
                </Link>
              </div>
            </div>

            {loadError ? (
              <p className="text-sm font-medium text-flare" role="alert">
                {loadError}
              </p>
            ) : items.length === 0 ? (
              <div className="rounded-md border border-ink/10 bg-white/70 p-5">
                <p className="font-heading text-base font-semibold text-ink">No leads yet</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  Share the link above. First graduate through her code appears here automatically.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-ink/10 bg-white/80">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="bg-ink/[0.03]">
                    <tr className="border-b border-ink/10 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
                      <th className="px-4 py-3 font-medium">When</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Telegram</th>
                      <th className="px-4 py-3 font-medium">WhatsApp</th>
                      <th className="px-4 py-3 font-medium">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-ink/8 align-top last:border-b-0"
                        data-testid="partner-lead-row"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-ink/45">
                          {formatWhen(item.createdAt)}
                        </td>
                        <td className="px-4 py-3 font-medium text-ink">{item.name || "—"}</td>
                        <td className="px-4 py-3 text-ink/80">{item.telegram || "—"}</td>
                        <td className="px-4 py-3 text-ink/80">{item.whatsapp || "—"}</td>
                        <td className="max-w-[220px] px-4 py-3 text-ink/65">{item.note || "—"}</td>
                      </tr>
                    ))}
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
