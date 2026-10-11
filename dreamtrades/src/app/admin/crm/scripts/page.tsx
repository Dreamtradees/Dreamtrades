import { CopyButton } from "@/components/crm/copy-button";
import { CrmLocked, CrmShell } from "@/components/crm/crm-shell";
import { ownerAdminAuthorized } from "@/lib/admin-auth";
import { FOLLOW_UP_SCRIPTS } from "@/lib/crm-scripts";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ key?: string }>;
};

export default async function CrmScriptsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const key = params.key?.trim() || "";
  if (!ownerAdminAuthorized(key)) {
    return <CrmLocked />;
  }

  return (
    <CrmShell adminKey={key} current="scripts">
      <div className="max-w-3xl space-y-6" data-testid="crm-scripts">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">Follow-up scripts</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-ink">
            Copy, personalise, send yourself
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            These notes are for the DreamTrades team. Replace {"{name}"} with the person’s name,
            then paste into Telegram or WhatsApp and send it yourself. The desk never sends these.
          </p>
        </div>
        {FOLLOW_UP_SCRIPTS.map((script) => (
          <article
            key={script.id}
            className="rounded-md border border-ink/10 bg-white/80 p-5"
            data-testid={`script-${script.id}`}
          >
            <p className="font-heading text-lg font-semibold text-ink">{script.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{script.when}</p>
            <pre className="mt-4 whitespace-pre-wrap rounded-md border border-ink/10 bg-[#f4f7f8] p-4 font-sans text-sm leading-relaxed text-ink">
              {script.body}
            </pre>
            <div className="mt-4">
              <CopyButton text={script.body} label="Copy script" testId={`copy-${script.id}`} />
            </div>
          </article>
        ))}
      </div>
    </CrmShell>
  );
}
