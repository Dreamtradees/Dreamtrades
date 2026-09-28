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

export interface CursorClient {
  createAgent(input: CreateAgentInput): Promise<{ agent: AgentSummary; run: RunSummary }>;
  createRun(input: CreateRunInput): Promise<RunSummary>;
  getAgent(agentId: string): Promise<AgentSummary>;
  getRun(agentId: string, runId: string): Promise<RunSummary>;
  cancelRun(agentId: string, runId: string): Promise<void>;
  waitForRun(
    agentId: string,
    runId: string,
    opts?: { timeoutMs?: number; pollMs?: number },
  ): Promise<RunSummary>;
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

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: this.authHeader(),
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
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

    const data = await this.request<{
      agent: AgentSummary;
      run: RunSummary;
    }>("POST", "/v1/agents", payload);

    return data;
  }

  async createRun(input: CreateRunInput) {
    return this.request<RunSummary>("POST", `/v1/agents/${input.agentId}/runs`, {
      prompt: { text: input.text },
    });
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

  async waitForRun(
    agentId: string,
    runId: string,
    opts: { timeoutMs?: number; pollMs?: number } = {},
  ) {
    const timeoutMs = opts.timeoutMs ?? 15 * 60 * 1000;
    const pollMs = opts.pollMs ?? 2500;
    const started = Date.now();

    while (Date.now() - started < timeoutMs) {
      const run = await this.getRun(agentId, runId);
      if (["FINISHED", "ERROR", "CANCELLED", "EXPIRED"].includes(run.status)) {
        return run;
      }
      await new Promise((r) => setTimeout(r, pollMs));
    }

    throw new Error(`Timed out waiting for run ${runId}`);
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
    const run: RunSummary = {
      id: runId,
      agentId,
      status: "RUNNING",
    };
    this.agents.set(agentId, agent);
    this.runs.set(runId, run);

    setTimeout(() => {
      const finished: RunSummary = {
        ...run,
        status: "FINISHED",
        durationMs: 1200,
        result:
          `Mock agent finished.\n\nPrompt: ${input.text}\n` +
          (input.repoUrl ? `Repo: ${input.repoUrl}@${input.startingRef || "main"}\n` : "") +
          `\nAdd TELEGRAM_BOT_TOKEN + CURSOR_API_KEY to .env to go live.`,
      };
      this.runs.set(runId, finished);
      this.agents.set(agentId, { ...agent, status: "IDLE" });
    }, 800);

    return { agent, run };
  }

  async createRun(input: CreateRunInput) {
    const runId = this.id("run");
    const run: RunSummary = {
      id: runId,
      agentId: input.agentId,
      status: "RUNNING",
    };
    this.runs.set(runId, run);
    const agent = this.agents.get(input.agentId);
    if (agent) {
      this.agents.set(input.agentId, {
        ...agent,
        status: "ACTIVE",
        latestRunId: runId,
      });
    }

    setTimeout(() => {
      this.runs.set(runId, {
        ...run,
        status: "FINISHED",
        durationMs: 900,
        result: `Mock follow-up finished.\n\n${input.text}`,
      });
      if (agent) {
        this.agents.set(input.agentId, { ...agent, status: "IDLE", latestRunId: runId });
      }
    }, 700);

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

  async waitForRun(agentId: string, runId: string) {
    for (let i = 0; i < 40; i++) {
      const run = await this.getRun(agentId, runId);
      if (["FINISHED", "ERROR", "CANCELLED", "EXPIRED"].includes(run.status)) {
        return run;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error(`Mock wait timed out for ${runId}`);
  }
}
