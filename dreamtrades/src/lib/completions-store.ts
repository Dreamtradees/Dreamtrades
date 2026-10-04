import type { CompletionRecord } from "@/lib/completions";

const COUNT_KEY = "dreamtrades:completions:count";
const LIST_KEY = "dreamtrades:completions:list";
const MAX_LIST = 200;

type MemoryStore = {
  count: number;
  items: CompletionRecord[];
};

declare global {
  // eslint-disable-next-line no-var
  var __dreamtradesCompletionsMemory: MemoryStore | undefined;
}

function memoryStore(): MemoryStore {
  if (!globalThis.__dreamtradesCompletionsMemory) {
    globalThis.__dreamtradesCompletionsMemory = { count: 0, items: [] };
  }
  return globalThis.__dreamtradesCompletionsMemory;
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
  record: CompletionRecord;
};

function saveInMemory(record: CompletionRecord): SaveCompletionResult {
  const mem = memoryStore();
  mem.count += 1;
  mem.items.unshift(record);
  if (mem.items.length > MAX_LIST) mem.items.length = MAX_LIST;
  return { count: mem.count, durable: false, record };
}

/**
 * Persist a graduate lead.
 * Prefer Upstash Redis (durable across Vercel cold starts). Falls back to
 * process memory when Redis is missing or fails so Telegram notify can still fire.
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
        record,
      };
    } catch (err) {
      console.error("[completions-store] Redis save failed; using memory fallback", err);
      return saveInMemory(record);
    }
  }

  return saveInMemory(record);
}

export async function getCompletionStats(): Promise<{
  count: number | null;
  durable: boolean;
}> {
  if (redisConfigured()) {
    try {
      const raw = await redisExec<string | number | null>(["GET", COUNT_KEY]);
      const count = raw == null ? 0 : Number(raw);
      return { count: Number.isFinite(count) ? count : 0, durable: true };
    } catch (err) {
      console.error("[completions-store] Redis stats failed", err);
    }
  }

  const mem = memoryStore();
  return { count: mem.count > 0 ? mem.count : null, durable: false };
}

export async function listCompletions(limit = 100): Promise<{
  items: CompletionRecord[];
  count: number;
  durable: boolean;
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
      };
    } catch (err) {
      console.error("[completions-store] Redis list failed; using memory", err);
    }
  }

  const mem = memoryStore();
  return {
    items: mem.items.slice(0, safeLimit),
    count: mem.count,
    durable: false,
  };
}
