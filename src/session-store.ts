import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

export type ChatSession = {
  chatId: number;
  userId: number;
  agentId: string | null;
  agentUrl: string | null;
  runId: string | null;
  repoUrl: string;
  startingRef: string;
  modelId: string | null;
  lastStatus: string | null;
  updatedAt: string;
};

type StoreShape = {
  chats: Record<string, ChatSession>;
};

export class SessionStore {
  private path: string;
  private data: StoreShape;

  constructor(path = join(process.cwd(), "data", "sessions.json")) {
    this.path = path;
    mkdirSync(dirname(path), { recursive: true });
    this.data = this.read();
  }

  private read(): StoreShape {
    if (!existsSync(this.path)) return { chats: {} };
    try {
      return JSON.parse(readFileSync(this.path, "utf8")) as StoreShape;
    } catch {
      return { chats: {} };
    }
  }

  private persist() {
    writeFileSync(this.path, JSON.stringify(this.data, null, 2));
  }

  list(): ChatSession[] {
    return Object.values(this.data.chats).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  }

  get(chatId: number): ChatSession | null {
    return this.data.chats[String(chatId)] ?? null;
  }

  upsert(
    chatId: number,
    userId: number,
    defaults: { repoUrl: string; startingRef: string; modelId?: string },
  ): ChatSession {
    const existing = this.get(chatId);
    const next: ChatSession = {
      chatId,
      userId,
      agentId: existing?.agentId ?? null,
      agentUrl: existing?.agentUrl ?? null,
      runId: existing?.runId ?? null,
      repoUrl: existing?.repoUrl || defaults.repoUrl,
      startingRef: existing?.startingRef || defaults.startingRef,
      modelId: existing?.modelId ?? defaults.modelId ?? null,
      lastStatus: existing?.lastStatus ?? null,
      updatedAt: new Date().toISOString(),
    };
    this.data.chats[String(chatId)] = next;
    this.persist();
    return next;
  }

  update(chatId: number, patch: Partial<ChatSession>): ChatSession {
    const current = this.get(chatId);
    if (!current) {
      throw new Error(`No session for chat ${chatId}`);
    }
    const next = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.data.chats[String(chatId)] = next;
    this.persist();
    return next;
  }

  clearAgent(chatId: number): ChatSession {
    return this.update(chatId, {
      agentId: null,
      agentUrl: null,
      runId: null,
      lastStatus: null,
    });
  }
}
