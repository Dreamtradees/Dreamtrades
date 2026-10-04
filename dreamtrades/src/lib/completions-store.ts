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

export function redisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

async function redisExec<T>(command: (string | number)[]): Promise<T> {
  const base = process.env.UPSTASH_REDIS_REST_URL!.trim().replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!.trim();
  const res = await fetch(base, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
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

export async function saveCompletion(
  record: CompletionRecord,
): Promise<SaveCompletionResult> {
  if (redisConfigured()) {
    const count = await redisExec<number>(["INCR", COUNT_KEY]);
    await redisExec<number>(["LPUSH", LIST_KEY, JSON.stringify(record)]);
    await redisExec<string>(["LTRIM", LIST_KEY, 0, MAX_LIST - 1]);
    return { count, durable: true, record };
  }

  const mem = memoryStore();
  mem.count += 1;
  mem.items.unshift(record);
  if (mem.items.length > MAX_LIST) mem.items.length = MAX_LIST;
  return { count: mem.count, durable: false, record };
}

export async function getCompletionStats(): Promise<{
  count: number | null;
  durable: boolean;
}> {
  if (redisConfigured()) {
    const raw = await redisExec<string | number | null>(["GET", COUNT_KEY]);
    const count = raw == null ? 0 : Number(raw);
    return { count: Number.isFinite(count) ? count : 0, durable: true };
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
    const raw = await redisExec<string[]>(["LRANGE", LIST_KEY, 0, safeLimit - 1]);
    const countRaw = await redisExec<string | number | null>(["GET", COUNT_KEY]);
    const items = (raw || [])
      .map((row) => {
        try {
          return JSON.parse(row) as CompletionRecord;
        } catch {
          return null;
        }
      })
      .filter((row): row is CompletionRecord => Boolean(row));
    const count = countRaw == null ? items.length : Number(countRaw);
    return { items, count: Number.isFinite(count) ? count : items.length, durable: true };
  }

  const mem = memoryStore();
  return {
    items: mem.items.slice(0, safeLimit),
    count: mem.count,
    durable: false,
  };
}
