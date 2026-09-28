export type CreateAgentInput = {
  text: string;
  repoUrl?: string;
  startingRef?: string;
  modelId?: string | null;
  name?: string;
};

export type CreateRunInput = {
  agentId: string;
  text: string;
};

export type AgentSummary = {
  id: string;
  name?: string;
  status: string;
  url: string;
  latestRunId?: string | null;
};

export type RunSummary = {
  id: string;
  agentId: string;
  status: string;
  result?: string | null;
  durationMs?: number | null;
  git?: {
    branches?: Array<{
      repoUrl?: string;
      branch?: string;
      prUrl?: string;
    }>;
  } | null;
};

export type StreamEvent =
  | { type: "status"; status: string; runId?: string }
  | { type: "assistant"; text: string }
  | { type: "thinking"; text: string }
  | { type: "tool_call"; name: string; status: string }
  | {
      type: "result";
      status: string;
      text?: string;
      durationMs?: number;
      git?: RunSummary["git"];
      runId?: string;
    }
  | { type: "error"; message: string }
  | { type: "done" };

export type RunWatcher = {
  onEvent?: (event: StreamEvent) => void | Promise<void>;
  timeoutMs?: number;
};

export interface CursorClient {
  createAgent(input: CreateAgentInput): Promise<{ agent: AgentSummary; run: RunSummary }>;
  createRun(input: CreateRunInput): Promise<RunSummary>;
  getAgent(agentId: string): Promise<AgentSummary>;
  getRun(agentId: string, runId: string): Promise<RunSummary>;
  cancelRun(agentId: string, runId: string): Promise<void>;
  listAgents(limit?: number): Promise<AgentSummary[]>;
  watchRun(agentId: string, runId: string, opts?: RunWatcher): Promise<RunSummary>;
}

type ApiErrorBody = {
  error?: { message?: string; code?: string };
  message?: string;
};

export class LiveCursorClient implements CursorClient {
  constructor(
    private apiKey: string,
    private baseUrl = "https://api.cursor.com",
  ) {}

  private authHeader(): string {
    return `Basic ${Buffer.from(`${this.apiKey}:`).toString("base64")}`;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    timeoutMs = 45_000,
  ): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: this.authHeader(),
          Accept: "application/json",
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const text = await res.text();
      let json: unknown = null;
      if (text) {
        try {
          json = JSON.parse(text);
        } catch {
          json = { message: text };
        }
      }

      if (!res.ok) {
        const err = json as ApiErrorBody;
        const message =
          err?.error?.message || err?.message || `Cursor API ${res.status} on ${path}`;
        throw new Error(message);
      }

      return json as T;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`Cursor API timed out after ${Math.round(timeoutMs / 1000)}s on ${path}`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  async createAgent(input: CreateAgentInput) {
    const payload: Record<string, unknown> = {
      prompt: { text: input.text },
      name: input.name?.slice(0, 100),
    };

    if (input.modelId) {
      payload.model = { id: input.modelId };
    }

    if (input.repoUrl) {
      payload.repos = [
        {
          url: input.repoUrl,
          startingRef: input.startingRef || "main",
        },
      ];
    }

    // Creating a new cloud agent can take a while while capacity is allocated.
    const data = await this.request<{ agent: AgentSummary; run: RunSummary }>(
      "POST",
      "/v1/agents",
      payload,
      120_000,
    );
    if (!data?.agent?.id || !data?.run?.id) {
      throw new Error(`Unexpected createAgent response: ${JSON.stringify(data).slice(0, 300)}`);
    }
    return data;
  }

  async createRun(input: CreateRunInput) {
    // API wraps the run: { run: { id, ... } }
    const data = await this.request<{ run: RunSummary } | RunSummary>(
      "POST",
      `/v1/agents/${input.agentId}/runs`,
      { prompt: { text: input.text } },
      60_000,
    );
    const run = "run" in data && data.run ? data.run : (data as RunSummary);
    if (!run?.id) {
      throw new Error(`Unexpected createRun response: ${JSON.stringify(data).slice(0, 300)}`);
    }
    return run;
  }

  async getAgent(agentId: string) {
    return this.request<AgentSummary>("GET", `/v1/agents/${agentId}`);
  }

  async getRun(agentId: string, runId: string) {
    return this.request<RunSummary>("GET", `/v1/agents/${agentId}/runs/${runId}`);
  }

  async cancelRun(agentId: string, runId: string) {
    await this.request("POST", `/v1/agents/${agentId}/runs/${runId}/cancel`);
  }

  async listAgents(limit = 10) {
    const data = await this.request<{ items: AgentSummary[] }>(
      "GET",
      `/v1/agents?limit=${limit}&includeArchived=false`,
    );
    return data.items ?? [];
  }

  async watchRun(agentId: string, runId: string, opts: RunWatcher = {}) {
    if (!agentId || !runId) {
      throw new Error(`watchRun missing ids (agentId=${agentId}, runId=${runId})`);
    }
    try {
      return await this.streamRun(agentId, runId, opts);
    } catch (err) {
      console.warn("SSE stream failed, falling back to poll:", err);
      return this.pollRun(agentId, runId, opts);
    }
  }

  private async streamRun(agentId: string, runId: string, opts: RunWatcher) {
    const timeoutMs = opts.timeoutMs ?? 15 * 60 * 1000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(
        `${this.baseUrl}/v1/agents/${agentId}/runs/${runId}/stream`,
        {
          headers: {
            Authorization: this.authHeader(),
            Accept: "text/event-stream",
          },
          signal: controller.signal,
        },
      );

      if (!res.ok || !res.body) {
        throw new Error(`Stream HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let final: RunSummary | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let splitAt = buffer.indexOf("\n\n");
        while (splitAt !== -1) {
          const rawEvent = buffer.slice(0, splitAt);
          buffer = buffer.slice(splitAt + 2);
          const parsed = parseSseEvent(rawEvent);
          if (parsed) {
            await opts.onEvent?.(parsed);
            if (parsed.type === "result") {
              final = {
                id: runId,
                agentId,
                status: parsed.status,
                result: parsed.text ?? null,
                durationMs: parsed.durationMs ?? null,
                git: parsed.git ?? null,
              };
            }
            if (parsed.type === "done" && final) {
              return final;
            }
            if (parsed.type === "error") {
              throw new Error(parsed.message);
            }
          }
          splitAt = buffer.indexOf("\n\n");
        }
      }

      if (final) return final;
      return this.getRun(agentId, runId);
    } finally {
      clearTimeout(timer);
    }
  }

  private async pollRun(agentId: string, runId: string, opts: RunWatcher) {
    const timeoutMs = opts.timeoutMs ?? 15 * 60 * 1000;
    const started = Date.now();
    let lastStatus = "";

    while (Date.now() - started < timeoutMs) {
      const run = await this.getRun(agentId, runId);
      if (run.status !== lastStatus) {
        lastStatus = run.status;
        await opts.onEvent?.({ type: "status", status: run.status, runId });
      }
      if (["FINISHED", "ERROR", "CANCELLED", "EXPIRED"].includes(run.status)) {
        await opts.onEvent?.({
          type: "result",
          status: run.status,
          text: run.result ?? undefined,
          durationMs: run.durationMs ?? undefined,
          git: run.git,
          runId,
        });
        await opts.onEvent?.({ type: "done" });
        return run;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }

    throw new Error(`Timed out waiting for run ${runId}`);
  }
}

function parseSseEvent(raw: string): StreamEvent | null {
  let event = "message";
  const dataLines: string[] = [];
  for (const line of raw.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
  }
  if (dataLines.length === 0) return null;

  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(dataLines.join("\n")) as Record<string, unknown>;
  } catch {
    return null;
  }

  switch (event) {
    case "status":
      return { type: "status", status: String(data.status ?? ""), runId: data.runId as string };
    case "assistant":
      return { type: "assistant", text: String(data.text ?? "") };
    case "thinking":
      return { type: "thinking", text: String(data.text ?? "") };
    case "tool_call":
      return {
        type: "tool_call",
        name: String(data.name ?? "tool"),
        status: String(data.status ?? ""),
      };
    case "result":
      return {
        type: "result",
        status: String(data.status ?? ""),
        text: data.text as string | undefined,
        durationMs: data.durationMs as number | undefined,
        git: data.git as RunSummary["git"],
        runId: data.runId as string | undefined,
      };
    case "error":
      return {
        type: "error",
        message: String(data.message ?? data.code ?? "stream error"),
      };
    case "done":
      return { type: "done" };
    default:
      return null;
  }
}

export class MockCursorClient implements CursorClient {
  private agents = new Map<string, AgentSummary>();
  private runs = new Map<string, RunSummary>();
  private counter = 0;

  private id(prefix: string) {
    this.counter += 1;
    return `${prefix}-mock-${String(this.counter).padStart(4, "0")}`;
  }

  async createAgent(input: CreateAgentInput) {
    const agentId = this.id("bc");
    const runId = this.id("run");
    const agent: AgentSummary = {
      id: agentId,
      name: input.name || input.text.slice(0, 48),
      status: "ACTIVE",
      url: `https://cursor.com/agents/${agentId}`,
      latestRunId: runId,
    };
    const run: RunSummary = { id: runId, agentId, status: "RUNNING" };
    this.agents.set(agentId, agent);
    this.runs.set(runId, run);

    setTimeout(() => {
      this.runs.set(runId, {
        ...run,
        status: "FINISHED",
        durationMs: 900,
        result: `Mock agent finished.\n\nPrompt: ${input.text}`,
      });
      this.agents.set(agentId, { ...agent, status: "IDLE" });
    }, 600);

    return { agent, run };
  }

  async createRun(input: CreateRunInput) {
    const runId = this.id("run");
    const run: RunSummary = { id: runId, agentId: input.agentId, status: "RUNNING" };
    this.runs.set(runId, run);
    setTimeout(() => {
      this.runs.set(runId, {
        ...run,
        status: "FINISHED",
        durationMs: 500,
        result: `Mock follow-up finished.\n\n${input.text}`,
      });
    }, 500);
    return run;
  }

  async getAgent(agentId: string) {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Unknown mock agent ${agentId}`);
    return agent;
  }

  async getRun(agentId: string, runId: string) {
    const run = this.runs.get(runId);
    if (!run || run.agentId !== agentId) throw new Error(`Unknown mock run ${runId}`);
    return run;
  }

  async cancelRun(agentId: string, runId: string) {
    const run = await this.getRun(agentId, runId);
    this.runs.set(runId, { ...run, status: "CANCELLED", result: "Cancelled in mock mode." });
  }

  async listAgents() {
    return [...this.agents.values()];
  }

  async watchRun(agentId: string, runId: string, opts: RunWatcher = {}) {
    await opts.onEvent?.({ type: "status", status: "RUNNING", runId });
    await opts.onEvent?.({ type: "assistant", text: "Mock agent is drafting a reply… " });
    for (let i = 0; i < 40; i++) {
      const current = await this.getRun(agentId, runId);
      if (["FINISHED", "ERROR", "CANCELLED", "EXPIRED"].includes(current.status)) {
        await opts.onEvent?.({
          type: "result",
          status: current.status,
          text: current.result ?? undefined,
          durationMs: current.durationMs ?? undefined,
          runId,
        });
        await opts.onEvent?.({ type: "done" });
        return current;
      }
      await new Promise((r) => setTimeout(r, 100));
    }
    return this.getRun(agentId, runId);
  }
}
