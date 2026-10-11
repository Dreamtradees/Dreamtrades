"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  emptyLeadForm,
  formToPayload,
  LeadEditor,
  leadToForm,
  type LeadFormValues,
} from "@/components/crm/lead-editor";
import {
  ASSIGNEE_PRESETS,
  buildDashboard,
  CRM_STAGES,
  followUpStatus,
  formatDateLabel,
  formatUsd,
  formatWhen,
  leadsToCsv,
  matchesLeadQuery,
  SOURCE_PRESETS,
  todayIsoDate,
  type CrmLead,
  type CrmStage,
  type FollowUpStatus,
} from "@/lib/crm";
import { cn } from "@/lib/utils";

type FollowFilter = "all" | FollowUpStatus;

function percent(value: number | null): string {
  if (value == null) return "—";
  return `${Math.round(value * 100)}%`;
}

export function CrmWorkspace({
  initialLeads,
  adminKey,
  durable,
  backend,
}: {
  initialLeads: CrmLead[];
  adminKey: string;
  durable: boolean;
  backend: string;
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [today, setToday] = useState("");
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<CrmStage | "All">("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [followFilter, setFollowFilter] = useState<FollowFilter>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setToday(todayIsoDate());
  }, []);

  const assignees = useMemo(() => {
    const values = new Set<string>(ASSIGNEE_PRESETS);
    for (const lead of leads) {
      if (lead.assignedTo) values.add(lead.assignedTo);
    }
    return [...values];
  }, [leads]);

  const sources = useMemo(() => {
    const values = new Set<string>(SOURCE_PRESETS);
    for (const lead of leads) {
      if (lead.source) values.add(lead.source);
    }
    return [...values];
  }, [leads]);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      if (!matchesLeadQuery(lead, query)) return false;
      if (stageFilter !== "All" && lead.stage !== stageFilter) return false;
      if (assigneeFilter !== "All" && lead.assignedTo !== assigneeFilter) return false;
      if (sourceFilter !== "All" && lead.source !== sourceFilter) return false;
      if (followFilter !== "all") {
        const status = followUpStatus(lead.nextFollowUp, today, lead.stage);
        if (followFilter === "none") return status === "none";
        if (status !== followFilter) return false;
      }
      return true;
    });
  }, [leads, query, stageFilter, assigneeFilter, sourceFilter, followFilter, today]);

  const dashboard = useMemo(() => buildDashboard(leads, today), [leads, today]);
  const selected = leads.find((lead) => lead.id === selectedId) ?? null;

  function upsert(lead: CrmLead) {
    setLeads((current) => {
      const index = current.findIndex((row) => row.id === lead.id);
      if (index < 0) return [lead, ...current];
      const next = [...current];
      next[index] = lead;
      return next;
    });
  }

  function exportCsv() {
    const csv = leadsToCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dreamtrades-leads.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const storeLabel =
    backend === "redis"
      ? "Saved in Upstash Redis."
      : durable
        ? "Saved in the local file store."
        : "Held in memory on this server — add Upstash before you rely on it.";

  return (
    <div className="space-y-8" data-testid="crm-workspace">
      <section data-testid="crm-dashboard" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">Dashboard</p>
            <p className="mt-1 text-sm text-ink/60">{storeLabel}</p>
          </div>
          <p className="text-sm text-ink/55">{leads.length} leads on the desk</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Overdue follow-ups" value={String(dashboard.overdue)} tone={dashboard.overdue ? "alert" : "calm"} />
          <Stat label="Due today" value={String(dashboard.dueToday)} tone={dashboard.dueToday ? "today" : "calm"} />
          <Stat label="New leads this week" value={String(dashboard.newThisWeek)} hint="Last 7 days" />
          <Stat
            label="First deposits"
            value={String(dashboard.firstDepositCount)}
            hint={formatUsd(dashboard.firstDepositTotal)}
          />
        </div>
        <div className="overflow-x-auto rounded-md border border-ink/10 bg-white/80">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-ink/[0.03]">
              <tr className="border-b border-ink/10 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">In stage now</th>
                <th className="px-4 py-3 font-medium">Reached</th>
                <th className="px-4 py-3 font-medium">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.funnel.map((row, index) => (
                <tr key={row.stage} className="border-b border-ink/8 last:border-b-0">
                  <td className="px-4 py-3 font-medium text-ink">{row.stage}</td>
                  <td className="px-4 py-3 text-ink/80">{row.inStage}</td>
                  <td className="px-4 py-3 text-ink/80">{row.reached}</td>
                  <td className="px-4 py-3 text-ink/70">
                    {index === 0 ? "Top of the book" : `${percent(row.conversionFromPrevious)} from previous`}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3 font-medium text-ink">Lost</td>
                <td className="px-4 py-3 text-ink/80">{dashboard.lost}</td>
                <td className="px-4 py-3 text-ink/45">—</td>
                <td className="px-4 py-3 text-ink/55">Left the path. Still counted as having started.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs leading-relaxed text-ink/50">
          Conversion is estimated from the current stage. A lead in a later stage counts as having
          passed the earlier ones. Lost leads count at New only, because the desk does not store
          the stage they left from.
        </p>
      </section>

      <section className="rounded-md border border-ink/10 bg-white/70 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block sm:col-span-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">Search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, handle, country, broker, notes…"
                className="mt-1.5 w-full rounded-md border border-ink/15 bg-[#f4f7f8] px-3 py-2 text-sm outline-none ring-mark/40 focus:border-mark focus:ring-2"
                data-testid="crm-search"
              />
            </label>
            <FilterSelect label="Stage" value={stageFilter} onChange={(value) => setStageFilter(value as CrmStage | "All")}>
              <option value="All">All stages</option>
              {CRM_STAGES.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </FilterSelect>
            <FilterSelect label="Follow-up" value={followFilter} onChange={(value) => setFollowFilter(value as FollowFilter)}>
              <option value="all">Any follow-up</option>
              <option value="overdue">Overdue</option>
              <option value="today">Due today</option>
              <option value="upcoming">Upcoming</option>
              <option value="none">No date</option>
            </FilterSelect>
            <FilterSelect label="Assigned to" value={assigneeFilter} onChange={setAssigneeFilter}>
              <option value="All">Everyone</option>
              {assignees.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </FilterSelect>
            <FilterSelect label="Source" value={sourceFilter} onChange={setSourceFilter}>
              <option value="All">All sources</option>
              {sources.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </FilterSelect>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowAdd((open) => !open)}
              className={cn(buttonVariants({ size: "lg" }), "rounded-md bg-mark px-4 text-[#041512] hover:bg-[#14b8a0]")}
              data-testid="crm-add-toggle"
            >
              {showAdd ? "Close form" : "Add a lead"}
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-md border-ink/15 bg-white px-4")}
              data-testid="crm-export"
            >
              Export CSV
            </button>
          </div>
        </div>
        {showAdd ? (
          <AddLead
            adminKey={adminKey}
            onCreated={(lead) => {
              upsert(lead);
              setShowAdd(false);
              setSelectedId(lead.id);
            }}
          />
        ) : null}
      </section>

      <section data-testid="crm-board">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-ink">Stage board</h2>
          <p className="text-xs text-ink/50">{filtered.length} showing</p>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {CRM_STAGES.map((stage) => {
            const column = filtered.filter((lead) => lead.stage === stage);
            return (
              <div key={stage} className="w-64 shrink-0 rounded-md border border-ink/10 bg-white/60">
                <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2">
                  <p className="font-heading text-sm font-semibold text-ink">{stage}</p>
                  <span className="font-mono text-[11px] text-ink/50" data-testid={`crm-count-${stage}`}>
                    {column.length}
                  </span>
                </div>
                <div className="space-y-2 p-2">
                  {column.length === 0 ? (
                    <p className="px-1 py-3 text-xs text-ink/40">Empty</p>
                  ) : (
                    column.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        today={today}
                        onOpen={() => setSelectedId(lead.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section data-testid="crm-table">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-ink">Lead table</h2>
        <div className="mt-4 overflow-x-auto rounded-md border border-ink/10 bg-white/80">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-ink/[0.03]">
              <tr className="border-b border-ink/10 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
                <th className="px-3 py-3 font-medium">Lead</th>
                <th className="px-3 py-3 font-medium">Stage</th>
                <th className="px-3 py-3 font-medium">Contact</th>
                <th className="px-3 py-3 font-medium">Source</th>
                <th className="px-3 py-3 font-medium">Assigned</th>
                <th className="px-3 py-3 font-medium">Follow-up</th>
                <th className="px-3 py-3 font-medium">Deposit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-sm text-ink/55">
                    No leads match these filters.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => {
                  const status = followUpStatus(lead.nextFollowUp, today, lead.stage);
                  return (
                    <tr
                      key={lead.id}
                      className={cn(
                        "cursor-pointer border-b border-ink/8 align-top last:border-b-0",
                        status === "overdue" && "bg-[color-mix(in_srgb,#e85d4c_10%,white)]",
                        status === "today" && "bg-[color-mix(in_srgb,#0f9f8a_10%,white)]",
                      )}
                      onClick={() => setSelectedId(lead.id)}
                      data-testid="crm-row"
                    >
                      <td className="px-3 py-3">
                        <p className="font-medium text-ink">{lead.name || "—"}</p>
                        <p className="font-mono text-[11px] text-ink/45">{lead.id}</p>
                      </td>
                      <td className="px-3 py-3 text-ink/80">{lead.stage}</td>
                      <td className="px-3 py-3 text-ink/75">
                        <p>{lead.telegram || "—"}</p>
                        <p className="text-ink/55">{lead.whatsapp || "—"}</p>
                      </td>
                      <td className="px-3 py-3 text-ink/70">
                        <p>{lead.source || "—"}</p>
                        <p className="text-ink/45">{lead.country || ""}</p>
                      </td>
                      <td className="px-3 py-3 text-ink/70">{lead.assignedTo}</td>
                      <td className="px-3 py-3">
                        <FollowLabel status={status} date={lead.nextFollowUp} />
                      </td>
                      <td className="px-3 py-3 text-ink/75">{formatUsd(lead.firstDepositUsd)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected ? (
        <LeadDrawer
          lead={selected}
          adminKey={adminKey}
          today={today}
          onClose={() => setSelectedId(null)}
          onSaved={(lead) => {
            upsert(lead);
            setSelectedId(lead.id);
          }}
        />
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone = "calm",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "calm" | "alert" | "today";
}) {
  return (
    <div
      className={cn(
        "rounded-md border p-4",
        tone === "alert" && "border-flare/40 bg-[color-mix(in_srgb,#e85d4c_8%,white)]",
        tone === "today" && "border-mark/40 bg-[color-mix(in_srgb,#0f9f8a_10%,white)]",
        tone === "calm" && "border-ink/10 bg-white/80",
      )}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">{label}</p>
      <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-1 text-sm text-ink/55">{hint}</p> : null}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-ink/15 bg-[#f4f7f8] px-3 py-2 text-sm outline-none ring-mark/40 focus:border-mark focus:ring-2"
      >
        {children}
      </select>
    </label>
  );
}

function LeadCard({
  lead,
  today,
  onOpen,
}: {
  lead: CrmLead;
  today: string;
  onOpen: () => void;
}) {
  const status = followUpStatus(lead.nextFollowUp, today, lead.stage);
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "w-full rounded-md border bg-white p-3 text-left",
        status === "overdue" && "border-flare/50 bg-[color-mix(in_srgb,#e85d4c_8%,white)]",
        status === "today" && "border-mark/50",
        status !== "overdue" && status !== "today" && "border-ink/10",
      )}
    >
      <p className="font-medium text-ink">{lead.name || "Unnamed"}</p>
      <p className="mt-0.5 font-mono text-[11px] text-ink/45">{lead.id}</p>
      <p className="mt-2 text-xs text-ink/60">{lead.telegram || lead.whatsapp || "No contact yet"}</p>
      <div className="mt-2">
        <FollowLabel status={status} date={lead.nextFollowUp} />
      </div>
    </button>
  );
}

function FollowLabel({ status, date }: { status: FollowUpStatus; date: string }) {
  if (status === "overdue") {
    return <p className="text-xs font-medium text-flare">Overdue · {formatDateLabel(date)}</p>;
  }
  if (status === "today") {
    return <p className="text-xs font-medium text-mark">Due today</p>;
  }
  if (status === "upcoming") {
    return <p className="text-xs text-ink/55">{formatDateLabel(date)}</p>;
  }
  return <p className="text-xs text-ink/40">No follow-up</p>;
}

function AddLead({
  adminKey,
  onCreated,
}: {
  adminKey: string;
  onCreated: (lead: CrmLead) => void;
}) {
  const [form, setForm] = useState<LeadFormValues>(emptyLeadForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/crm?key=${encodeURIComponent(adminKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPayload(form)),
      });
      const data = (await res.json().catch(() => null)) as { error?: string; lead?: CrmLead } | null;
      if (!res.ok || !data?.lead) {
        setError(data?.error || "Could not add the lead.");
        return;
      }
      setForm(emptyLeadForm());
      onCreated(data.lead);
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 border-t border-ink/10 pt-4" data-testid="crm-add-form">
      <p className="font-heading text-base font-semibold text-ink">Add a lead</p>
      <p className="mt-1 mb-4 text-sm text-ink/60">
        For someone the team already spoke to. Website signups land here on their own.
      </p>
      <LeadEditor
        form={form}
        onChange={setForm}
        onSubmit={save}
        submitLabel="Save lead"
        busy={busy}
        error={error}
      />
    </div>
  );
}

function LeadDrawer({
  lead,
  adminKey,
  today,
  onClose,
  onSaved,
}: {
  lead: CrmLead;
  adminKey: string;
  today: string;
  onClose: () => void;
  onSaved: (lead: CrmLead) => void;
}) {
  const [form, setForm] = useState<LeadFormValues>(() => leadToForm(lead));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(leadToForm(lead));
    setError(null);
  }, [lead]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/crm?key=${encodeURIComponent(adminKey)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, ...formToPayload(form) }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string; lead?: CrmLead } | null;
      if (!res.ok || !data?.lead) {
        setError(data?.error || "Could not save changes.");
        return;
      }
      onSaved(data.lead);
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  }

  const status = followUpStatus(lead.nextFollowUp, today, lead.stage);

  return (
    <div className="fixed inset-0 z-40 flex justify-end" data-testid="crm-drawer">
      <button
        type="button"
        className="absolute inset-0 bg-ink/30"
        aria-label="Close lead"
        onClick={onClose}
      />
      <div className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-[#f7f9fb] shadow-xl">
        <div className="sticky top-0 z-10 border-b border-ink/10 bg-[#f7f9fb]/95 px-5 py-4 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mark">{lead.id}</p>
              <p className="mt-1 font-heading text-xl font-semibold text-ink">{lead.name || "Lead"}</p>
              <p className="mt-1 text-xs text-ink/50">Created {formatWhen(lead.createdAt)}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-ink/15 px-3 py-1.5 text-sm text-ink/70 hover:text-ink"
            >
              Close
            </button>
          </div>
          {status === "overdue" ? (
            <p className="mt-3 text-sm font-medium text-flare">Follow-up is overdue.</p>
          ) : null}
          {status === "today" ? (
            <p className="mt-3 text-sm font-medium text-mark">Follow-up is due today.</p>
          ) : null}
        </div>
        <div className="px-5 py-5">
          {lead.completionId ? (
            <p className="mb-4 text-sm text-ink/60">
              Came in from the checklist. Stage starts at Course. The graduate list still has the original claim.
            </p>
          ) : null}
          {lead.notifyError ? (
            <p className="mb-4 text-xs leading-relaxed text-ink/50">
              Owner Telegram: {lead.notified ? "sent" : "not sent"} — {lead.notifyError}
            </p>
          ) : lead.notified ? (
            <p className="mb-4 text-xs text-ink/50">Owner Telegram note was sent when this lead arrived.</p>
          ) : null}
          <LeadEditor
            form={form}
            onChange={setForm}
            onSubmit={save}
            submitLabel="Save changes"
            busy={busy}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
