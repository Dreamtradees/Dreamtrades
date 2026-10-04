import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { CompletionRecord } from "@/lib/completions";

const COUNT_KEY = "dreamtrades:completions:count";
const LIST_KEY = "dreamtrades:completions:list";
const MAX_LIST = 200;

export type StoreBackend = "redis" | "file" | "memory";

type MemoryStore = {
  count: number;
  items: CompletionRecord[];
};

declare global {
  // eslint-disable-next-line no-var
  var __dreamtradesCompletionsMemory: MemoryStore | undefined;
  // eslint-disable-next-line no-var
  var __dreamtradesCompletionsFileLoaded: boolean | undefined;
}

function memoryStore(): MemoryStore {
  if (!globalThis.__dreamtradesCompletionsMemory) {
    globalThis.__dreamtradesCompletionsMemory = { count: 0, items: [] };
  }
  return globalThis.__dreamtradesCompletionsMemory;
}

/**
 * Local/dev file path for leads when Redis is not configured.
 * Survives process restarts (unlike pure memory). Not used on Vercel
 * serverless (ephemeral FS) — set Upstash there instead.
 */
function fileStorePath(): string {
  const override = process.env.COMPLETIONS_FILE_PATH?.trim();
  if (override) return override;
  return path.join(process.cwd(), ".data", "completions.json");
}

function fileStoreAllowed(): boolean {
  // Explicit opt-in, or automatic in development / memory-allow mode.
  if (process.env.COMPLETIONS_USE_FILE === "0") return false;
  if (process.env.COMPLETIONS_USE_FILE === "1") return true;
  return (
    process.env.NODE_ENV === "development" ||
    process.env.COMPLETIONS_ALLOW_MEMORY === "1"
  );
}

function loadFileIntoMemory(): void {
  if (globalThis.__dreamtradesCompletionsFileLoaded) return;
  globalThis.__dreamtradesCompletionsFileLoaded = true;

  if (!fileStoreAllowed()) return;

  const filePath = fileStorePath();
  if (!existsSync(/* turbopackIgnore: true */ filePath)) return;

  try {
    // Local/dev only — ignore for Turbopack tracing (not used on Vercel with Redis).
    const raw = readFileSync(/* turbopackIgnore: true */ filePath, "utf8");
    const parsed = JSON.parse(raw) as {
      count?: number;
      items?: CompletionRecord[];
    };
    const mem = memoryStore();
    mem.count = Number.isFinite(Number(parsed.count)) ? Number(parsed.count) : 0;
    mem.items = Array.isArray(parsed.items) ? parsed.items.slice(0, MAX_LIST) : [];
  } catch (err) {
    console.error("[completions-store] Failed to load file store", err);
  }
}

function persistMemoryToFile(): void {
  if (!fileStoreAllowed()) return;

  const mem = memoryStore();
  const filePath = fileStorePath();
  try {
    mkdirSync(/* turbopackIgnore: true */ path.dirname(filePath), { recursive: true });
    writeFileSync(
      /* turbopackIgnore: true */ filePath,
      JSON.stringify({ count: mem.count, items: mem.items }, null, 2),
      "utf8",
    );
  } catch (err) {
    console.error("[completions-store] Failed to write file store", err);
  }
}

/**
 * Upstash Redis REST credentials.
 * Supports both Upstash console names and Vercel Marketplace / Vercel KV aliases.
 */
export function redisCredentials(): { url: string; token: string } | null {
  const url = (
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    ""
  ).trim();
  const token = (
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    ""
  ).trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

export function redisConfigured(): boolean {
  return Boolean(redisCredentials());
}

export function localFileStoreActive(): boolean {
  return !redisConfigured() && fileStoreAllowed();
}

async function redisPipeline(commands: (string | number)[][]): Promise<unknown[]> {
  const creds = redisCredentials();
  if (!creds) throw new Error("Redis is not configured");

  const res = await fetch(`${creds.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstash pipeline error ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as Array<{ result?: unknown; error?: string }>;
  if (!Array.isArray(json)) {
    throw new Error("Unexpected Upstash pipeline response");
  }

  for (const row of json) {
    if (row?.error) throw new Error(row.error);
  }

  return json.map((row) => row.result);
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

export type SaveCompletionResult = {
  count: number;
  durable: boolean;
  backend: StoreBackend;
  record: CompletionRecord;
};

function saveLocal(record: CompletionRecord): SaveCompletionResult {
  loadFileIntoMemory();
  const mem = memoryStore();
  mem.count += 1;
  mem.items.unshift(record);
  if (mem.items.length > MAX_LIST) mem.items.length = MAX_LIST;

  const usingFile = fileStoreAllowed();
  if (usingFile) persistMemoryToFile();

  return {
    count: mem.count,
    durable: usingFile,
    backend: usingFile ? "file" : "memory",
    record,
  };
}

/**
 * Persist a graduate lead.
 * Prefer Upstash Redis (durable across Vercel cold starts). Falls back to
 * local file (dev) or process memory so Telegram notify can still fire.
 */
export async function saveCompletion(
  record: CompletionRecord,
): Promise<SaveCompletionResult> {
  if (redisConfigured()) {
    try {
      const results = await redisPipeline([
        ["INCR", COUNT_KEY],
        ["LPUSH", LIST_KEY, JSON.stringify(record)],
        ["LTRIM", LIST_KEY, 0, MAX_LIST - 1],
      ]);
      const count = Number(results[0]);
      return {
        count: Number.isFinite(count) ? count : 0,
        durable: true,
        backend: "redis",
        record,
      };
    } catch (err) {
      console.error("[completions-store] Redis save failed; using local fallback", err);
      return saveLocal(record);
    }
  }

  return saveLocal(record);
}

/**
 * Patch notify outcome onto an already-saved lead.
 * Best-effort — never throws to the claim path.
 */
export async function updateCompletionNotifyStatus(
  id: string,
  notified: boolean,
  notifyError: string | null,
): Promise<void> {
  try {
    if (redisConfigured()) {
      try {
        const raw = await redisExec<string[] | null>(["LRANGE", LIST_KEY, 0, MAX_LIST - 1]);
        const rows = raw || [];
        for (let i = 0; i < rows.length; i++) {
          try {
            const item = JSON.parse(rows[i]) as CompletionRecord;
            if (item.id !== id) continue;
            const updated: CompletionRecord = {
              ...item,
              notified,
              notifyError: notifyError || null,
            };
            await redisExec(["LSET", LIST_KEY, i, JSON.stringify(updated)]);
            return;
          } catch {
            // skip bad row
          }
        }
        return;
      } catch (err) {
        console.error("[completions-store] Redis notify patch failed", err);
        // fall through to local patch
      }
    }

    loadFileIntoMemory();
    const mem = memoryStore();
    const idx = mem.items.findIndex((item) => item.id === id);
    if (idx < 0) return;
    mem.items[idx] = {
      ...mem.items[idx],
      notified,
      notifyError: notifyError || null,
    };
    if (fileStoreAllowed()) persistMemoryToFile();
  } catch (err) {
    console.error("[completions-store] updateCompletionNotifyStatus failed", err);
  }
}

export async function getCompletionStats(): Promise<{
  count: number | null;
  durable: boolean;
  backend: StoreBackend;
}> {
  if (redisConfigured()) {
    try {
      const raw = await redisExec<string | number | null>(["GET", COUNT_KEY]);
      const count = raw == null ? 0 : Number(raw);
      return {
        count: Number.isFinite(count) ? count : 0,
        durable: true,
        backend: "redis",
      };
    } catch (err) {
      console.error("[completions-store] Redis stats failed", err);
    }
  }

  loadFileIntoMemory();
  const mem = memoryStore();
  const usingFile = fileStoreAllowed();
  return {
    count: mem.count > 0 ? mem.count : null,
    durable: usingFile,
    backend: usingFile ? "file" : "memory",
  };
}

export async function listCompletions(limit = 100): Promise<{
  items: CompletionRecord[];
  count: number;
  durable: boolean;
  backend: StoreBackend;
}> {
  const safeLimit = Math.min(Math.max(limit, 1), MAX_LIST);

  if (redisConfigured()) {
    try {
      const results = await redisPipeline([
        ["LRANGE", LIST_KEY, 0, safeLimit - 1],
        ["GET", COUNT_KEY],
      ]);
      const raw = (results[0] as string[] | null) || [];
      const countRaw = results[1] as string | number | null;
      const items = raw
        .map((row) => {
          try {
            return JSON.parse(row) as CompletionRecord;
          } catch {
            return null;
          }
        })
        .filter((row): row is CompletionRecord => Boolean(row));
      const count = countRaw == null ? items.length : Number(countRaw);
      return {
        items,
        count: Number.isFinite(count) ? count : items.length,
        durable: true,
        backend: "redis",
      };
    } catch (err) {
      console.error("[completions-store] Redis list failed; using local", err);
    }
  }

  loadFileIntoMemory();
  const mem = memoryStore();
  const usingFile = fileStoreAllowed();
  return {
    items: mem.items.slice(0, safeLimit),
    count: mem.count,
    durable: usingFile,
    backend: usingFile ? "file" : "memory",
  };
}
