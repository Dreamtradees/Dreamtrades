import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { CompletionRecord } from "@/lib/completions";
import {
  applyLeadPatch,
  DEFAULT_ASSIGNEE,
  formatCrmId,
  isCrmStage,
  parseCrmId,
  sameContact,
  SOURCE_CHECKLIST,
  type CrmLead,
  type CrmLeadInput,
} from "@/lib/crm";
import {
  listCompletions,
  redisConfigured,
  redisCredentials,
  type StoreBackend,
} from "@/lib/completions-store";

const CRM_KEY = "dreamtrades:crm:v1";
const MAX_LEADS = 2000;

type CrmDocument = {
  seq: number;
  leads: CrmLead[];
  importedCompletionIds: string[];
};

export type CrmSnapshot = {
  leads: CrmLead[];
  count: number;
  durable: boolean;
  backend: StoreBackend;
  importedNow: number;
};

type MemoryDoc = {
  doc: CrmDocument;
};

declare global {
  var __dreamtradesCrmMemory: MemoryDoc | undefined;
  var __dreamtradesCrmFileLoaded: boolean | undefined;
  var __dreamtradesCrmLock: Promise<unknown> | undefined;
}

function emptyDoc(): CrmDocument {
  return { seq: 0, leads: [], importedCompletionIds: [] };
}

function memory(): MemoryDoc {
  if (!globalThis.__dreamtradesCrmMemory) {
    globalThis.__dreamtradesCrmMemory = { doc: emptyDoc() };
  }
  return globalThis.__dreamtradesCrmMemory;
}

function fileStorePath(): string {
  const override = process.env.CRM_FILE_PATH?.trim();
  if (override) return override;
  return path.join(process.cwd(), ".data", "crm.json");
}

function fileStoreAllowed(): boolean {
  if (process.env.COMPLETIONS_USE_FILE === "0") return false;
  if (process.env.COMPLETIONS_USE_FILE === "1") return true;
  return (
    process.env.NODE_ENV === "development" ||
    process.env.COMPLETIONS_ALLOW_MEMORY === "1"
  );
}

function loadFileIntoMemory(): void {
  if (globalThis.__dreamtradesCrmFileLoaded) return;
  globalThis.__dreamtradesCrmFileLoaded = true;
  if (!fileStoreAllowed()) return;

  const filePath = fileStorePath();
  if (!existsSync(/* turbopackIgnore: true */ filePath)) return;

  try {
    const raw = readFileSync(/* turbopackIgnore: true */ filePath, "utf8");
    memory().doc = parseDocument(raw);
  } catch (err) {
    console.error("[crm-store] Failed to load file store", err);
  }
}

function persistMemoryToFile(): void {
  if (!fileStoreAllowed()) return;
  const filePath = fileStorePath();
  try {
    mkdirSync(/* turbopackIgnore: true */ path.dirname(filePath), { recursive: true });
    writeFileSync(
      /* turbopackIgnore: true */ filePath,
      JSON.stringify(memory().doc),
      "utf8",
    );
  } catch (err) {
    console.error("[crm-store] Failed to write file store", err);
  }
}

function normalizeLead(raw: CrmLead): CrmLead {
  const deposit = raw.firstDepositUsd;
  return {
    id: raw.id,
    name: raw.name || "",
    telegram: raw.telegram || "",
    whatsapp: raw.whatsapp || "",
    country: raw.country || "",
    source: raw.source || "",
    campaign: raw.campaign || "",
    broker: raw.broker || "",
    accountNumber: raw.accountNumber || "",
    firstDepositUsd: typeof deposit === "number" && Number.isFinite(deposit) ? deposit : null,
    firstDepositDate: raw.firstDepositDate || "",
    assignedTo: raw.assignedTo || DEFAULT_ASSIGNEE,
    stage: isCrmStage(raw.stage) ? raw.stage : "New",
    lastContact: raw.lastContact || "",
    nextFollowUp: raw.nextFollowUp || "",
    notes: raw.notes || "",
    consent: raw.consent === true,
    createdAt: raw.createdAt || new Date(0).toISOString(),
    updatedAt: raw.updatedAt || raw.createdAt || new Date(0).toISOString(),
    completionId: raw.completionId,
    notified: raw.notified,
    notifyError: raw.notifyError ?? null,
  };
}

function parseDocument(raw: string): CrmDocument {
  const parsed = JSON.parse(raw) as Partial<CrmDocument>;
  const leads = Array.isArray(parsed.leads)
    ? parsed.leads.filter(isLeadShape).map(normalizeLead)
    : [];
  const imported = Array.isArray(parsed.importedCompletionIds)
    ? parsed.importedCompletionIds.filter((id): id is string => typeof id === "string")
    : [];
  const seq = Number.isFinite(Number(parsed.seq)) ? Number(parsed.seq) : 0;
  return { seq, leads: leads.slice(0, MAX_LEADS), importedCompletionIds: imported };
}

function isLeadShape(value: unknown): value is CrmLead {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<CrmLead>;
  return typeof row.id === "string" && row.id.startsWith("DT-") && typeof row.stage === "string";
}

async function redisExec<T>(command: (string | number)[]): Promise<T> {
  const creds = redisCredentials();
  if (!creds) throw new Error("Redis is not configured");

  const res = await fetch(creds.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstash error ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as { result: T; error?: string };
  if (json.error) throw new Error(json.error);
  return json.result;
}

async function readRemote(): Promise<CrmDocument> {
  const raw = await redisExec<string | null>(["GET", CRM_KEY]);
  if (raw == null || raw === "") return emptyDoc();
  return parseDocument(raw);
}

async function writeRemote(doc: CrmDocument): Promise<void> {
  await redisExec(["SET", CRM_KEY, JSON.stringify(doc)]);
}

function locked<T>(task: () => Promise<T>): Promise<T> {
  const previous = globalThis.__dreamtradesCrmLock ?? Promise.resolve();
  const run = previous.then(task, task);
  globalThis.__dreamtradesCrmLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function repairSeq(doc: CrmDocument): boolean {
  let max = Number.isFinite(doc.seq) ? doc.seq : 0;
  for (const lead of doc.leads) {
    max = Math.max(max, parseCrmId(lead.id));
  }
  if (max !== doc.seq) {
    doc.seq = max;
    return true;
  }
  return false;
}

/**
 * Organic checklist graduates become Course leads.
 * Rows that already carry a partner ref stay on the graduate list and are not copied here.
 */
function importGraduates(doc: CrmDocument, completions: CompletionRecord[]): number {
  const known = new Set(doc.importedCompletionIds);
  for (const lead of doc.leads) {
    if (lead.completionId) known.add(lead.completionId);
  }

  const pending = completions
    .filter((record) => !record.ref?.trim() && record.id && !known.has(record.id))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  let added = 0;
  for (const record of pending) {
    if (doc.leads.length >= MAX_LEADS) break;
    doc.seq += 1;
    const now = record.createdAt || new Date().toISOString();
    const lead: CrmLead = {
      id: formatCrmId(doc.seq),
      name: record.name || "",
      telegram: record.telegram || "",
      whatsapp: record.whatsapp || "",
      country: "",
      source: SOURCE_CHECKLIST,
      campaign: "",
      broker: "",
      accountNumber: "",
      firstDepositUsd: null,
      firstDepositDate: "",
      assignedTo: DEFAULT_ASSIGNEE,
      stage: "Course",
      lastContact: "",
      nextFollowUp: "",
      notes: record.note || "",
      consent: true,
      createdAt: now,
      updatedAt: now,
      completionId: record.id,
      notified: record.notified,
      notifyError: record.notifyError ?? null,
    };
    doc.leads.push(lead);
    doc.importedCompletionIds.push(record.id);
    known.add(record.id);
    added += 1;
  }
  return added;
}

async function loadDocument(): Promise<{ doc: CrmDocument; backend: StoreBackend; durable: boolean }> {
  if (redisConfigured()) {
    try {
      const doc = await readRemote();
      return { doc, backend: "redis", durable: true };
    } catch (err) {
      console.error("[crm-store] Redis read failed; using local fallback", err);
    }
  }

  loadFileIntoMemory();
  const usingFile = fileStoreAllowed();
  return {
    doc: memory().doc,
    backend: usingFile ? "file" : "memory",
    durable: usingFile,
  };
}

/**
 * Overlay a local snapshot onto whatever is already stored.
 * Same id keeps the newer updatedAt. A checklist import that is already
 * stored is skipped so two cold starts do not create two DT rows.
 */
function mergeDocuments(persisted: CrmDocument, local: CrmDocument): CrmDocument {
  const leads = persisted.leads.map(normalizeLead);
  const ids = new Set(leads.map((lead) => lead.id));
  let seq = Math.max(
    persisted.seq,
    local.seq,
    ...leads.map((lead) => parseCrmId(lead.id)),
    0,
  );

  for (const lead of local.leads) {
    const byCompletion = lead.completionId
      ? leads.findIndex((row) => row.completionId === lead.completionId)
      : -1;
    if (byCompletion >= 0 && leads[byCompletion].id !== lead.id) {
      continue;
    }
    const existingIndex = leads.findIndex((row) => row.id === lead.id);
    if (existingIndex >= 0) {
      if (lead.updatedAt >= leads[existingIndex].updatedAt) {
        leads[existingIndex] = lead;
      }
      continue;
    }
    let stored = lead;
    if (ids.has(stored.id) || parseCrmId(stored.id) === 0) {
      seq += 1;
      stored = { ...lead, id: formatCrmId(seq) };
    }
    leads.push(stored);
    ids.add(stored.id);
    seq = Math.max(seq, parseCrmId(stored.id));
  }

  return {
    seq,
    leads: leads.slice(0, MAX_LEADS),
    importedCompletionIds: [
      ...new Set([...persisted.importedCompletionIds, ...local.importedCompletionIds]),
    ],
  };
}

async function saveDocument(
  doc: CrmDocument,
  backend: StoreBackend,
): Promise<void> {
  if (backend === "redis") {
    const persisted = await readRemote();
    const merged = mergeDocuments(persisted, doc);
    await writeRemote(merged);
    doc.seq = merged.seq;
    doc.leads.splice(0, doc.leads.length, ...merged.leads);
    doc.importedCompletionIds = merged.importedCompletionIds;
    return;
  }
  memory().doc = doc;
  if (fileStoreAllowed()) persistMemoryToFile();
}

function sortNewest(leads: CrmLead[]): CrmLead[] {
  return [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function withDocument<T>(
  mutate: (doc: CrmDocument) => Promise<T> | T,
): Promise<{ result: T; backend: StoreBackend; durable: boolean; doc: CrmDocument }> {
  return locked(async () => {
    const loaded = await loadDocument();
    const doc = loaded.doc;
    repairSeq(doc);
    let completions: CompletionRecord[] = [];
    try {
      const listed = await listCompletions(200);
      completions = listed.items;
    } catch (err) {
      console.error("[crm-store] Could not read checklist graduates for import", err);
    }
    importGraduates(doc, completions);
    const result = await mutate(doc);
    await saveDocument(doc, loaded.backend);
    return { result, backend: loaded.backend, durable: loaded.durable, doc };
  });
}

export async function listCrmLeads(): Promise<CrmSnapshot> {
  const { doc, backend, durable } = await withDocument(() => undefined);
  return {
    leads: sortNewest(doc.leads),
    count: doc.leads.length,
    durable,
    backend,
    importedNow: 0,
  };
}

export type CreateCrmLeadResult = {
  lead: CrmLead;
  created: boolean;
  backend: StoreBackend;
  durable: boolean;
};

export async function createCrmLead(
  fields: Omit<CrmLead, "id" | "createdAt" | "updatedAt" | "completionId">,
  options?: { dedupe?: boolean },
): Promise<CreateCrmLeadResult> {
  return locked(async () => {
    const loaded = await loadDocument();
    const doc = loaded.doc;
    repairSeq(doc);
    try {
      const listed = await listCompletions(200);
      importGraduates(doc, listed.items);
    } catch (err) {
      console.error("[crm-store] Could not read checklist graduates for import", err);
    }

    if (options?.dedupe) {
      const existing = doc.leads.find((lead) =>
        sameContact(lead, fields.telegram, fields.whatsapp),
      );
      if (existing) {
        await saveDocument(doc, loaded.backend);
        return {
          lead: existing,
          created: false,
          backend: loaded.backend,
          durable: loaded.durable,
        };
      }
    }

    if (doc.leads.length >= MAX_LEADS) {
      throw new Error("The DreamTrades desk is full. Export a CSV and archive older notes before adding more.");
    }

    doc.seq += 1;
    const now = new Date().toISOString();
    const lead: CrmLead = {
      ...fields,
      id: formatCrmId(doc.seq),
      createdAt: now,
      updatedAt: now,
    };
    doc.leads.push(lead);
    await saveDocument(doc, loaded.backend);
    const stored =
      doc.leads.find((row) => row.id === lead.id) ??
      doc.leads.find(
        (row) => row.createdAt === lead.createdAt && row.telegram === lead.telegram && row.whatsapp === lead.whatsapp,
      ) ??
      lead;
    return {
      lead: stored,
      created: true,
      backend: loaded.backend,
      durable: loaded.durable,
    };
  });
}

export async function updateCrmLead(
  id: string,
  patch: CrmLeadInput,
): Promise<{ lead: CrmLead; backend: StoreBackend; durable: boolean } | null> {
  const outcome = await withDocument((doc) => {
    const index = doc.leads.findIndex((lead) => lead.id === id);
    if (index < 0) return null;
    const parsed = applyLeadPatch(doc.leads[index], patch);
    if (!parsed.ok) {
      const error = new Error(parsed.error);
      error.name = "CrmValidationError";
      throw error;
    }
    doc.leads[index] = parsed.value;
    return parsed.value;
  });
  if (!outcome.result) return null;
  return { lead: outcome.result, backend: outcome.backend, durable: outcome.durable };
}

export function isCrmValidationError(err: unknown): err is Error {
  return err instanceof Error && err.name === "CrmValidationError";
}

export async function markCrmLeadNotify(
  id: string,
  notified: boolean,
  notifyError: string | null,
): Promise<void> {
  try {
    await withDocument((doc) => {
      const index = doc.leads.findIndex((lead) => lead.id === id);
      if (index < 0) return;
      doc.leads[index] = {
        ...doc.leads[index],
        notified,
        notifyError,
      };
    });
  } catch (err) {
    console.error("[crm-store] markCrmLeadNotify failed", err);
  }
}
