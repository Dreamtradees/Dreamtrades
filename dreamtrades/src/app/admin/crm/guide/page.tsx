import { CrmLocked, CrmShell } from "@/components/crm/crm-shell";
import { ownerAdminAuthorized } from "@/lib/admin-auth";
import { CRM_STAGES } from "@/lib/crm";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ key?: string }>;
};

const STAGES: { name: (typeof CRM_STAGES)[number]; body: string }[] = [
  {
    name: "New",
    body: "Someone just arrived and has not been welcomed yet. Website signups land here. Send the welcome script by hand, then move them to Welcomed.",
  },
  {
    name: "Welcomed",
    body: "You have said hello and they know DreamTrades will stay in touch. They have not finished the course yet.",
  },
  {
    name: "Course",
    body: "They are in the lessons, or they already graduated the checklist. Existing checklist graduates are imported here.",
  },
  {
    name: "Broker account",
    body: "They have a broker account, or they are opening one. Record the broker and account number when you have them. If two days pass with no account, use the 48-hour script.",
  },
  {
    name: "First deposit",
    body: "The account is funded. Enter the USD amount and the date. That is what the dashboard totals. If a week passes with an open account and no deposit, use the 7-day script.",
  },
  {
    name: "VIP",
    body: "They are funded and you have invited them into the VIP room. Send the invite yourself — the desk does not send it.",
  },
  {
    name: "Active Trader",
    body: "They are trading with a plan and still in contact. Keep a follow-up date so they do not go quiet.",
  },
  {
    name: "Lost",
    body: "They stopped, asked to pause, or you cannot reach them. Lost leads drop out of overdue highlighting. You can move them back if they return.",
  },
];

const FIELDS: { name: string; body: string }[] = [
  { name: "ID", body: "A DreamTrades number such as DT-0001. The desk assigns it. You cannot edit it." },
  { name: "Name", body: "Who you are talking to. Required." },
  { name: "Telegram", body: "Their @username. Stored with the @ so you can paste it into a chat." },
  { name: "WhatsApp", body: "Their number, digits with an optional leading +. Use the channel they actually answer." },
  { name: "Country", body: "Useful when a broker or document rule depends on where they live. Free text." },
  { name: "Source", body: "How they found DreamTrades. Website form and Checklist graduate are set automatically. You can type another source." },
  { name: "Campaign", body: "Optional label for a class, a month, or a post, so you can see which wave someone came from." },
  { name: "Broker", body: "The broker they opened, once you know it." },
  { name: "Account number", body: "Their account id at that broker. Stored as text so leading zeros stay intact." },
  { name: "First deposit USD and date", body: "The first amount they funded, in US dollars, and the day it landed. Empty means you do not have it yet. Zero is not counted as a deposit on the dashboard." },
  { name: "Assigned to", body: "Defaults to DreamTrades team. Pick Unassigned, or type a desk name if more than one person is working the book." },
  { name: "Stage", body: "Where they are on the path. See the stage list above. Move it when the real-world step changes, not before." },
  { name: "Last contact", body: "The last day someone on the team actually spoke to them." },
  { name: "Next follow-up", body: "The day you intend to write again. Overdue dates are highlighted. Lost leads are not highlighted." },
  { name: "Notes", body: "Anything the next person on the team should know. Checklist notes are copied here on import." },
  { name: "Consent", body: "They agreed DreamTrades may contact them. Website and checklist leads already confirmed this. Keep it honest if they later ask you to stop." },
  { name: "Created date", body: "When the lead was stored. Imported graduates keep the original claim time." },
];

export default async function CrmGuidePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const key = params.key?.trim() || "";
  if (!ownerAdminAuthorized(key)) {
    return <CrmLocked />;
  }

  return (
    <CrmShell adminKey={key} current="guide">
      <article className="max-w-3xl space-y-10" data-testid="crm-guide">
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">How to use</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-ink">
            The DreamTrades lead desk, in plain English
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            This desk is only for DreamTrades. It keeps one record per person, shows where they
            are, and reminds you who to write today. It does not message anyone. You copy a script,
            paste it into Telegram or WhatsApp, and send it yourself.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-heading text-xl font-semibold text-ink">A normal day</h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink/70">
            <li>Open the desk with your admin key. Bookmark that URL. Do not share it.</li>
            <li>Check the dashboard for overdue follow-ups, anything due today, and new leads this week.</li>
            <li>Open the person, read the notes, copy the matching script, and send it yourself.</li>
            <li>Set Last contact to today and Next follow-up to the day you will write again. Save.</li>
            <li>Move the stage only when their real situation has changed.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h3 className="font-heading text-xl font-semibold text-ink">Where leads come from</h3>
          <ul className="space-y-2 text-sm leading-relaxed text-ink/70">
            <li>
              <span className="font-medium text-ink">Website form.</span> The homepage form stores
              them as stage New, source Website form, assigned to DreamTrades team. You also get the
              usual owner Telegram note.
            </li>
            <li>
              <span className="font-medium text-ink">Checklist graduates.</span> People who finished
              the course and submitted the claim are imported as stage Course. The original graduate
              list stays where it is.
            </li>
            <li>
              <span className="font-medium text-ink">Added by hand.</span> Use Add a lead for someone
              you met in chat. Consent has to be ticked.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="font-heading text-xl font-semibold text-ink">The screen</h3>
          <div className="space-y-3 text-sm leading-relaxed text-ink/70">
            <p>
              <span className="font-medium text-ink">Dashboard.</span> Funnel counts, conversion from
              the previous stage, overdue and today follow-ups, new leads in the last 7 days, and
              the number plus total of first deposits.
            </p>
            <p>
              <span className="font-medium text-ink">Stage board.</span> One column per stage, with
              a count. Overdue cards are marked in red. Due-today cards are marked in green. Click
              a card to edit.
            </p>
            <p>
              <span className="font-medium text-ink">Table.</span> Search by name, handle, country,
              broker, notes, or lead id. Filter by stage, follow-up, assignee, and source. The same
              colours mark overdue and due-today rows.
            </p>
            <p>
              <span className="font-medium text-ink">Lead drawer.</span> Every field is editable.
              Save writes the record. Close or press Escape to leave without a second confirmation —
              unsaved edits are dropped.
            </p>
            <p>
              <span className="font-medium text-ink">Export CSV.</span> Downloads the rows you are
              currently filtering, so you can keep a spreadsheet copy.
            </p>
            <p>
              <span className="font-medium text-ink">Scripts.</span> Welcome, 48 hours with no
              account, 7 days with no deposit, and the funded VIP invite. Copy, then send by hand.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-heading text-xl font-semibold text-ink">Stages</h3>
          <ol className="space-y-4">
            {STAGES.map((stage, index) => (
              <li key={stage.name} className="rounded-md border border-ink/10 bg-white/75 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mark">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 font-heading text-lg font-semibold text-ink">{stage.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{stage.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <h3 className="font-heading text-xl font-semibold text-ink">Fields</h3>
          <dl className="divide-y divide-ink/10 rounded-md border border-ink/10 bg-white/75">
            {FIELDS.map((field) => (
              <div key={field.name} className="px-4 py-3">
                <dt className="font-medium text-ink">{field.name}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink/70">{field.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-md border border-ink/10 bg-white/75 p-5">
          <h3 className="font-heading text-xl font-semibold text-ink">What this desk never does</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/70">
            <li>It never messages a client by itself.</li>
            <li>It never spends money, opens a broker account, or moves a deposit.</li>
            <li>It is not a second book for anyone outside DreamTrades.</li>
            <li>The public graduate count on the checklist stays separate from this desk.</li>
          </ul>
        </section>
      </article>
    </CrmShell>
  );
}
