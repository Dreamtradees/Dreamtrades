/**
 * DreamTrades lead desk — types, validation, funnel math, and CSV.
 * Pure module: safe to import from server routes and client UI.
 * This book is for DreamTrades only. It has no partner, affiliate, or commission fields.
 */

export const CRM_STAGES = [
  "New",
  "Welcomed",
  "Course",
  "Broker account",
  "First deposit",
  "VIP",
  "Active Trader",
  "Lost",
] as const;

export type CrmStage = (typeof CRM_STAGES)[number];

/** Ordered path used for funnel conversion. Lost sits outside this path. */
export const CRM_FUNNEL_STAGES = [
  "New",
  "Welcomed",
  "Course",
  "Broker account",
  "First deposit",
  "VIP",
  "Active Trader",
] as const satisfies readonly CrmStage[];

export const DEFAULT_ASSIGNEE = "DreamTrades team";

export const ASSIGNEE_PRESETS = ["DreamTrades team", "Unassigned"] as const;

export const SOURCE_WEBSITE = "Website form";
export const SOURCE_CHECKLIST = "Checklist graduate";
export const SOURCE_MANUAL = "Manual";

export const SOURCE_PRESETS = [
  SOURCE_WEBSITE,
  SOURCE_CHECKLIST,
  SOURCE_MANUAL,
  "Instagram",
  "Telegram",
  "WhatsApp",
  "Word of mouth",
] as const;

export type CrmLead = {
  id: string;
  name: string;
  telegram: string;
  whatsapp: string;
  country: string;
  source: string;
  campaign: string;
  broker: string;
  accountNumber: string;
  firstDepositUsd: number | null;
  firstDepositDate: string;
  assignedTo: string;
  stage: CrmStage;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
  consent: boolean;
  createdAt: string;
  updatedAt: string;
  /** Checklist claim id, when this row was imported from the graduate list. */
  completionId?: string;
  notified?: boolean;
  notifyError?: string | null;
};

export type CrmLeadInput = {
  name?: unknown;
  telegram?: unknown;
  whatsapp?: unknown;
  country?: unknown;
  source?: unknown;
  campaign?: unknown;
  broker?: unknown;
  accountNumber?: unknown;
  firstDepositUsd?: unknown;
  firstDepositDate?: unknown;
  assignedTo?: unknown;
  stage?: unknown;
  lastContact?: unknown;
  nextFollowUp?: unknown;
  notes?: unknown;
  consent?: unknown;
};

const MAX_NAME = 80;
const MAX_TELEGRAM = 64;
const MAX_WHATSAPP = 32;
const MAX_SHORT = 80;
const MAX_ACCOUNT = 40;
const MAX_NOTES = 2000;
const MAX_DEPOSIT = 10_000_000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function formatCrmId(seq: number): string {
  const n = Math.max(1, Math.floor(seq));
  return `DT-${String(n).padStart(4, "0")}`;
}

export function parseCrmId(id: string): number {
  const match = /^DT-(\d+)$/.exec(id.trim());
  if (!match) return 0;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : 0;
}

export function isCrmStage(value: string): value is CrmStage {
  return (CRM_STAGES as readonly string[]).includes(value);
}

function asTrimmed(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function normalizeTelegram(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const withoutAt = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  return withoutAt.replace(/\s+/g, "");
}

export function normalizeWhatsapp(raw: string): string {
  return raw.trim().replace(/[^\d+]/g, "");
}

function telegramError(handle: string): string | null {
  if (!handle) return null;
  if (!/^[A-Za-z][A-Za-z0-9_]{3,31}$/.test(handle)) {
    return "Telegram username looks off — use letters, numbers, underscore (4–32 chars).";
  }
  return null;
}

function whatsappError(number: string): string | null {
  if (!number) return null;
  if (!/^\+?\d{7,15}$/.test(number)) {
    return "WhatsApp number looks off — use digits with optional leading +.";
  }
  return null;
}

export function isCalendarDate(value: string): boolean {
  if (!value) return true;
  if (!DATE_RE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function dateOrError(value: unknown, label: string): { ok: true; value: string } | { ok: false; error: string } {
  if (value == null || value === "") return { ok: true, value: "" };
  const text = asTrimmed(value, 10);
  if (!isCalendarDate(text) || !text) {
    return { ok: false, error: `${label} needs a real calendar date (YYYY-MM-DD).` };
  }
  return { ok: true, value: text };
}

function depositOrError(
  value: unknown,
): { ok: true; value: number | null } | { ok: false; error: string } {
  if (value == null || value === "") return { ok: true, value: null };
  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[$,\s]/g, ""));
  if (!Number.isFinite(numeric) || numeric < 0 || numeric > MAX_DEPOSIT) {
    return { ok: false, error: "First deposit needs a USD amount from 0 up to 10,000,000." };
  }
  return { ok: true, value: Math.round(numeric * 100) / 100 };
}

export type FollowUpStatus = "none" | "overdue" | "today" | "upcoming";

/** Calendar date in the viewer's local timezone, YYYY-MM-DD. */
export function todayIsoDate(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function followUpStatus(
  nextFollowUp: string,
  today: string,
  stage: CrmStage,
): FollowUpStatus {
  if (!nextFollowUp || !today || stage === "Lost") return "none";
  if (nextFollowUp < today) return "overdue";
  if (nextFollowUp === today) return "today";
  return "upcoming";
}

export function formatUsd(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatWhen(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateLabel(isoDate: string): string {
  if (!isoDate) return "—";
  if (!isCalendarDate(isoDate)) return isoDate;
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export type CrmLeadDraft = {
  name: string;
  telegram: string;
  whatsapp: string;
  country: string;
  source: string;
  campaign: string;
  broker: string;
  accountNumber: string;
  firstDepositUsd: number | null;
  firstDepositDate: string;
  assignedTo: string;
  stage: CrmStage;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
  consent: boolean;
};

function readContactFields(
  input: CrmLeadInput,
  defaults: {
    source: string;
    stage: CrmStage;
    requireBothChannels: boolean;
    requireName: boolean;
    requireConsent?: boolean;
  },
): { ok: true; value: CrmLeadDraft } | { ok: false; error: string } {
  const name = asTrimmed(input.name, MAX_NAME);
  if (defaults.requireName && !name) {
    return { ok: false, error: "Add a name so the team knows who to ask for." };
  }

  const telegramRaw = asTrimmed(input.telegram, MAX_TELEGRAM);
  const whatsappRaw = asTrimmed(input.whatsapp, MAX_WHATSAPP);
  const telegramHandle = normalizeTelegram(telegramRaw);
  const whatsapp = normalizeWhatsapp(whatsappRaw);
  const tgError = telegramError(telegramHandle);
  if (tgError) return { ok: false, error: tgError };
  const waError = whatsappError(whatsapp);
  if (waError) return { ok: false, error: waError };

  if (defaults.requireBothChannels) {
    if (!telegramHandle) {
      return { ok: false, error: "Add your Telegram @username so we can reach you." };
    }
    if (!whatsapp) {
      return { ok: false, error: "Add your WhatsApp number so we can reach you." };
    }
  } else if (!telegramHandle && !whatsapp) {
    return {
      ok: false,
      error: "Add a Telegram username or a WhatsApp number so someone can reply.",
    };
  }

  const requireConsent = defaults.requireConsent !== false;
  if (requireConsent && input.consent !== true) {
    return { ok: false, error: "Confirm the person agreed to be contacted." };
  }
  const consent = input.consent === true;

  const stageRaw = asTrimmed(input.stage, 40) || defaults.stage;
  if (!isCrmStage(stageRaw)) {
    return { ok: false, error: "Pick a stage from the DreamTrades list." };
  }

  const depositDate = dateOrError(input.firstDepositDate, "First deposit date");
  if (!depositDate.ok) return depositDate;
  const lastContact = dateOrError(input.lastContact, "Last contact");
  if (!lastContact.ok) return lastContact;
  const nextFollowUp = dateOrError(input.nextFollowUp, "Next follow-up");
  if (!nextFollowUp.ok) return nextFollowUp;
  const deposit = depositOrError(input.firstDepositUsd);
  if (!deposit.ok) return deposit;

  const assignedTo = asTrimmed(input.assignedTo, MAX_SHORT) || DEFAULT_ASSIGNEE;
  const source = asTrimmed(input.source, MAX_SHORT) || defaults.source;

  return {
    ok: true,
    value: {
      name,
      telegram: telegramHandle ? `@${telegramHandle}` : "",
      whatsapp,
      country: asTrimmed(input.country, MAX_SHORT),
      source,
      campaign: asTrimmed(input.campaign, MAX_SHORT),
      broker: asTrimmed(input.broker, MAX_SHORT),
      accountNumber: asTrimmed(input.accountNumber, MAX_ACCOUNT),
      firstDepositUsd: deposit.value,
      firstDepositDate: depositDate.value,
      assignedTo,
      stage: stageRaw,
      lastContact: lastContact.value,
      nextFollowUp: nextFollowUp.value,
      notes: asTrimmed(input.notes, MAX_NOTES),
      consent,
    },
  };
}

/** Public homepage form. Stage and source are fixed by the server. */
export function validateWebsiteSignup(
  input: CrmLeadInput,
): { ok: true; value: CrmLeadDraft } | { ok: false; error: string } {
  return readContactFields(
    {
      ...input,
      source: SOURCE_WEBSITE,
      stage: "New",
      country: "",
      campaign: "",
      broker: "",
      accountNumber: "",
      firstDepositUsd: null,
      firstDepositDate: "",
      assignedTo: DEFAULT_ASSIGNEE,
      lastContact: "",
      nextFollowUp: "",
      notes: "",
    },
    { source: SOURCE_WEBSITE, stage: "New", requireBothChannels: true, requireName: true },
  );
}

/** Lead added by the team inside the desk. */
export function validateManualLead(
  input: CrmLeadInput,
): { ok: true; value: CrmLeadDraft } | { ok: false; error: string } {
  return readContactFields(input, {
    source: SOURCE_MANUAL,
    stage: "New",
    requireBothChannels: false,
    requireName: true,
  });
}

export function applyLeadPatch(
  lead: CrmLead,
  patch: CrmLeadInput,
): { ok: true; value: CrmLead } | { ok: false; error: string } {
  const merged: CrmLeadInput = {
    name: patch.name !== undefined ? patch.name : lead.name,
    telegram: patch.telegram !== undefined ? patch.telegram : lead.telegram,
    whatsapp: patch.whatsapp !== undefined ? patch.whatsapp : lead.whatsapp,
    country: patch.country !== undefined ? patch.country : lead.country,
    source: patch.source !== undefined ? patch.source : lead.source,
    campaign: patch.campaign !== undefined ? patch.campaign : lead.campaign,
    broker: patch.broker !== undefined ? patch.broker : lead.broker,
    accountNumber: patch.accountNumber !== undefined ? patch.accountNumber : lead.accountNumber,
    firstDepositUsd:
      patch.firstDepositUsd !== undefined ? patch.firstDepositUsd : lead.firstDepositUsd,
    firstDepositDate:
      patch.firstDepositDate !== undefined ? patch.firstDepositDate : lead.firstDepositDate,
    assignedTo: patch.assignedTo !== undefined ? patch.assignedTo : lead.assignedTo,
    stage: patch.stage !== undefined ? patch.stage : lead.stage,
    lastContact: patch.lastContact !== undefined ? patch.lastContact : lead.lastContact,
    nextFollowUp: patch.nextFollowUp !== undefined ? patch.nextFollowUp : lead.nextFollowUp,
    notes: patch.notes !== undefined ? patch.notes : lead.notes,
    consent: patch.consent !== undefined ? patch.consent : lead.consent,
  };

  const parsed = readContactFields(merged, {
    source: lead.source || SOURCE_MANUAL,
    stage: lead.stage,
    requireBothChannels: false,
    requireName: true,
    requireConsent: false,
  });
  if (!parsed.ok) return parsed;

  return {
    ok: true,
    value: {
      ...lead,
      ...parsed.value,
      id: lead.id,
      createdAt: lead.createdAt,
      completionId: lead.completionId,
      notified: lead.notified,
      notifyError: lead.notifyError,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function blankLeadDraft(): CrmLeadDraft {
  return {
    name: "",
    telegram: "",
    whatsapp: "",
    country: "",
    source: SOURCE_MANUAL,
    campaign: "",
    broker: "",
    accountNumber: "",
    firstDepositUsd: null,
    firstDepositDate: "",
    assignedTo: DEFAULT_ASSIGNEE,
    stage: "New",
    lastContact: "",
    nextFollowUp: "",
    notes: "",
    consent: false,
  };
}

export type FunnelRow = {
  stage: (typeof CRM_FUNNEL_STAGES)[number];
  inStage: number;
  reached: number;
  conversionFromPrevious: number | null;
};

export type CrmDashboard = {
  funnel: FunnelRow[];
  lost: number;
  overdue: number;
  dueToday: number;
  newThisWeek: number;
  firstDepositCount: number;
  firstDepositTotal: number;
};

function funnelIndex(stage: CrmStage): number {
  return CRM_FUNNEL_STAGES.indexOf(stage as (typeof CRM_FUNNEL_STAGES)[number]);
}

/** A later stage counts as having passed earlier ones. Lost is counted at New only. */
export function buildDashboard(leads: CrmLead[], today: string, now = new Date()): CrmDashboard {
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - 6);
  const weekMs = weekStart.getTime();

  const funnel: FunnelRow[] = CRM_FUNNEL_STAGES.map((stage, index) => {
    const inStage = leads.filter((lead) => lead.stage === stage).length;
    const reached = leads.filter((lead) => {
      if (lead.stage === "Lost") return index === 0;
      const at = funnelIndex(lead.stage);
      return at >= index;
    }).length;
    const previous = index === 0 ? null : leads.filter((lead) => {
      if (lead.stage === "Lost") return false;
      return funnelIndex(lead.stage) >= index - 1;
    }).length;
    // New's "previous" includes Lost, because everyone entered at New.
    const previousReached = index === 0
      ? null
      : index === 1
        ? leads.length
        : previous;
    const conversionFromPrevious =
      previousReached == null || previousReached === 0
        ? null
        : reached / previousReached;
    return { stage, inStage, reached, conversionFromPrevious };
  });

  let firstDepositCount = 0;
  let firstDepositTotal = 0;
  for (const lead of leads) {
    if (lead.firstDepositUsd != null && lead.firstDepositUsd > 0) {
      firstDepositCount += 1;
      firstDepositTotal += lead.firstDepositUsd;
    }
  }

  return {
    funnel,
    lost: leads.filter((lead) => lead.stage === "Lost").length,
    overdue: today
      ? leads.filter((lead) => followUpStatus(lead.nextFollowUp, today, lead.stage) === "overdue").length
      : 0,
    dueToday: today
      ? leads.filter((lead) => followUpStatus(lead.nextFollowUp, today, lead.stage) === "today").length
      : 0,
    newThisWeek: leads.filter((lead) => {
      const created = new Date(lead.createdAt).getTime();
      return Number.isFinite(created) && created >= weekMs;
    }).length,
    firstDepositCount,
    firstDepositTotal: Math.round(firstDepositTotal * 100) / 100,
  };
}

export function matchesLeadQuery(lead: CrmLead, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    lead.id,
    lead.name,
    lead.telegram,
    lead.whatsapp,
    lead.country,
    lead.source,
    lead.campaign,
    lead.broker,
    lead.accountNumber,
    lead.assignedTo,
    lead.stage,
    lead.notes,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

function csvCell(value: string | number | boolean | null | undefined): string {
  const text = value == null ? "" : String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  if (/[",\n\r]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

const CSV_HEADERS = [
  "id",
  "name",
  "telegram",
  "whatsapp",
  "country",
  "source",
  "campaign",
  "broker",
  "accountNumber",
  "firstDepositUsd",
  "firstDepositDate",
  "assignedTo",
  "stage",
  "lastContact",
  "nextFollowUp",
  "notes",
  "consent",
  "createdAt",
  "updatedAt",
] as const;

export function leadsToCsv(leads: CrmLead[]): string {
  const lines = [CSV_HEADERS.join(",")];
  for (const lead of leads) {
    lines.push(
      [
        lead.id,
        lead.name,
        lead.telegram,
        lead.whatsapp,
        lead.country,
        lead.source,
        lead.campaign,
        lead.broker,
        lead.accountNumber,
        lead.firstDepositUsd ?? "",
        lead.firstDepositDate,
        lead.assignedTo,
        lead.stage,
        lead.lastContact,
        lead.nextFollowUp,
        lead.notes,
        lead.consent ? "yes" : "no",
        lead.createdAt,
        lead.updatedAt,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  return `\uFEFF${lines.join("\n")}\n`;
}

export function formatWebsiteLeadTelegram(lead: CrmLead): string {
  const lines = [
    "DreamTrades — new website lead",
    "",
    `Lead id: ${lead.id}`,
    `Name: ${lead.name || "—"}`,
    `Telegram: ${lead.telegram || "—"}`,
    `WhatsApp: ${lead.whatsapp || "—"}`,
    `Source: ${lead.source}`,
    `Stage: ${lead.stage}`,
    `Assigned to: ${lead.assignedTo}`,
    `When: ${lead.createdAt}`,
    "",
    "Nothing is sent to them automatically. Copy a script from /admin/crm/scripts and message them yourself.",
    "Desk: /admin/crm?key=…",
  ];
  return lines.join("\n");
}

export function sameContact(a: Pick<CrmLead, "telegram" | "whatsapp">, telegram: string, whatsapp: string): boolean {
  const tg = telegram.trim().toLowerCase();
  const wa = whatsapp.trim();
  if (tg && a.telegram.trim().toLowerCase() === tg) return true;
  if (wa && a.whatsapp.trim() === wa) return true;
  return false;
}
