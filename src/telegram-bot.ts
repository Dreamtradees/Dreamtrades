import { Bot, GrammyError, HttpError } from "grammy";
import type { AppConfig } from "./config.js";
import type { CursorClient, StreamEvent } from "./cursor-client.js";
import type { SessionStore } from "./session-store.js";

function isAllowed(config: AppConfig, userId: number | undefined): boolean {
  if (!userId) return false;
  if (config.telegramAllowedUserIds.length === 0) {
    return config.mockMode;
  }
  return config.telegramAllowedUserIds.includes(String(userId));
}

function helpText(config: AppConfig): string {
  const mode = config.mockMode ? "mock (no live tokens yet)" : "live";
  return [
    `Telegram ↔ Cursor bridge (${mode})`,
    "",
    "Commands:",
    "/start — connect this chat",
    "/whoami — show your Telegram user ID",
    "/help — show this help",
    "/status — show active agent + repo",
    "/repo <url> [branch] — set default repository",
    "/new <prompt> — start a new Cloud Agent",
    "/cancel — cancel the active run",
    "/reset — forget the active agent",
    "",
    "Or just send a message — it becomes a follow-up on your active agent,",
    "or starts a new one if none is active.",
  ].join("\n");
}

function truncate(text: string, max = 3500): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 20)}\n\n…truncated`;
}

export function createTelegramBot(
  config: AppConfig,
  cursor: CursorClient,
  sessions: SessionStore,
) {
  if (!config.telegramBotToken && !config.mockMode) {
    throw new Error("TELEGRAM_BOT_TOKEN is required in live mode");
  }

  const token = config.telegramBotToken || "000000000:MOCK_TOKEN_FOR_DASHBOARD_ONLY";
  const bot = new Bot(token);
  const busyChats = new Set<number>();

  bot.command("whoami", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
      await ctx.reply("Could not read your user ID from this update.");
      return;
    }
    await ctx.reply(
      [
        `Your Telegram user ID is: ${userId}`,
        "",
        "Put that number in TELEGRAM_ALLOWED_USER_IDS in .env, restart the bridge, then send /start.",
      ].join("\n"),
    );
  });

  bot.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!isAllowed(config, userId)) {
      if (ctx.chat && ctx.message) {
        await ctx.reply(
          [
            "This bot is locked to an allowlist.",
            userId ? `Your Telegram user ID is: ${userId}` : "Could not read your user ID.",
            "",
            "Set TELEGRAM_ALLOWED_USER_IDS to that number in .env, restart, then send /start.",
            "Tip: you can also send /whoami anytime to see your ID.",
          ].join("\n"),
        );
      }
      return;
    }
    await next();
  });

  bot.command("start", async (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from!.id;
    sessions.upsert(chatId, userId, {
      repoUrl: config.cursorDefaultRepo,
      startingRef: config.cursorDefaultRef,
      modelId: config.cursorDefaultModel,
    });
    await ctx.reply(
      [
        "Connected.",
        "",
        helpText(config),
        "",
        config.mockMode
          ? "Running in mock mode. Add TELEGRAM_BOT_TOKEN and CURSOR_API_KEY to .env, then restart."
          : "Live mode — messages will launch Cursor Cloud Agents.",
      ].join("\n"),
    );
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(helpText(config));
  });

  bot.command("status", async (ctx) => {
    const session = sessions.get(ctx.chat.id);
    if (!session) {
      await ctx.reply("No session yet. Send /start first.");
      return;
    }
    await ctx.reply(
      [
        `Mode: ${config.mockMode ? "mock" : "live"}`,
        `Repo: ${session.repoUrl || "(none — set with /repo)"}`,
        `Branch: ${session.startingRef}`,
        `Model: ${session.modelId || "(default)"}`,
        `Agent: ${session.agentId || "(none)"}`,
        `Run: ${session.runId || "(none)"}`,
        `Status: ${session.lastStatus || "(idle)"}`,
        busyChats.has(ctx.chat.id) ? "Bridge: working…" : "Bridge: idle",
        session.agentUrl ? `URL: ${session.agentUrl}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  });

  bot.command("repo", async (ctx) => {
    const text = ctx.message?.text ?? "";
    const parts = text.split(/\s+/).slice(1);
    if (parts.length === 0) {
      await ctx.reply("Usage: /repo https://github.com/org/repo [branch]");
      return;
    }
    const [repoUrl, branch] = parts;
    const session = sessions.upsert(ctx.chat.id, ctx.from!.id, {
      repoUrl: config.cursorDefaultRepo,
      startingRef: config.cursorDefaultRef,
      modelId: config.cursorDefaultModel,
    });
    sessions.update(ctx.chat.id, {
      repoUrl,
      startingRef: branch || session.startingRef,
    });
    await ctx.reply(`Repo set to ${repoUrl} @ ${branch || session.startingRef}`);
  });

  bot.command("reset", async (ctx) => {
    if (!sessions.get(ctx.chat.id)) {
      await ctx.reply("No session yet. Send /start first.");
      return;
    }
    sessions.clearAgent(ctx.chat.id);
    await ctx.reply("Cleared active agent. Next message starts a new one.");
  });

  bot.command("cancel", async (ctx) => {
    const session = sessions.get(ctx.chat.id);
    if (!session?.agentId || !session.runId) {
      await ctx.reply("Nothing to cancel.");
      return;
    }
    try {
      await cursor.cancelRun(session.agentId, session.runId);
      sessions.update(ctx.chat.id, { lastStatus: "CANCELLED" });
      await ctx.reply("Cancelled the active run.");
    } catch (err) {
      await ctx.reply(`Cancel failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  bot.command("new", async (ctx) => {
    const prompt = (ctx.message?.text ?? "").replace(/^\/new(@\w+)?\s*/i, "").trim();
    if (!prompt) {
      await ctx.reply("Usage: /new Add a health check endpoint");
      return;
    }
    sessions.upsert(ctx.chat.id, ctx.from!.id, {
      repoUrl: config.cursorDefaultRepo,
      startingRef: config.cursorDefaultRef,
      modelId: config.cursorDefaultModel,
    });
    sessions.clearAgent(ctx.chat.id);
    void runPrompt(ctx.chat.id, ctx.from!.id, prompt, true);
  });

  bot.on("message:text", async (ctx) => {
    if (ctx.message.text.startsWith("/")) return;
    void runPrompt(ctx.chat.id, ctx.from!.id, ctx.message.text, false);
  });

  async function runPrompt(
    chatId: number,
    userId: number,
    prompt: string,
    forceNew: boolean,
  ) {
    if (busyChats.has(chatId)) {
      await bot.api.sendMessage(
        chatId,
        "Still working on your last request. Send /cancel to abort, or wait for it to finish.",
      );
      return;
    }

    busyChats.add(chatId);
    const session = sessions.upsert(chatId, userId, {
      repoUrl: config.cursorDefaultRepo,
      startingRef: config.cursorDefaultRef,
      modelId: config.cursorDefaultModel,
    });

    let statusMessageId: number | null = null;
    let draftMessageId: number | null = null;
    let assistantBuffer = "";
    let lastDraftFlush = 0;
    let lastTool = "";

    const editOrSendStatus = async (text: string) => {
      try {
        if (statusMessageId) {
          await bot.api.editMessageText(chatId, statusMessageId, truncate(text, 500));
        } else {
          const msg = await bot.api.sendMessage(chatId, truncate(text, 500));
          statusMessageId = msg.message_id;
        }
      } catch {
        const msg = await bot.api.sendMessage(chatId, truncate(text, 500));
        statusMessageId = msg.message_id;
      }
    };

    const flushDraft = async (force = false) => {
      if (!assistantBuffer.trim()) return;
      const now = Date.now();
      if (!force && now - lastDraftFlush < 1500 && assistantBuffer.length < 350) return;
      lastDraftFlush = now;
      const body = truncate(`Drafting…\n\n${assistantBuffer}`);
      try {
        if (draftMessageId) {
          await bot.api.editMessageText(chatId, draftMessageId, body);
        } else {
          const msg = await bot.api.sendMessage(chatId, body);
          draftMessageId = msg.message_id;
        }
      } catch {
        const msg = await bot.api.sendMessage(chatId, body);
        draftMessageId = msg.message_id;
      }
    };

    const heartbeat = startHeartbeat(chatId, async (seconds) => {
      await editOrSendStatus(
        `Still working… (${seconds}s)\nStarting/waiting on Cursor Cloud Agents can take a minute.`,
      );
    });

    try {
      let agentId = session.agentId;
      let agentUrl = session.agentUrl;

      // Prefer follow-ups — creating a brand-new cloud agent is much slower.
      if (!forceNew && !agentId) {
        try {
          const existing = (await cursor.listAgents(10)).find((a) =>
            ["IDLE", "ACTIVE"].includes(a.status),
          );
          if (existing) {
            agentId = existing.id;
            agentUrl = existing.url;
            sessions.update(chatId, { agentId, agentUrl });
          }
        } catch (err) {
          console.warn("listAgents failed:", err);
        }
      }

      const startingNew = forceNew || !agentId;
      await bot.api.sendMessage(
        chatId,
        startingNew
          ? "Got it — starting a Cloud Agent (this step can take ~30–90s)…"
          : "Got it — sending follow-up…",
      );

      let runId: string;

      if (startingNew) {
        const { agent, run } = await cursor.createAgent({
          text: prompt,
          repoUrl: session.repoUrl || undefined,
          startingRef: session.startingRef,
          modelId: session.modelId,
          name: prompt.slice(0, 80),
        });
        agentId = agent.id;
        agentUrl = agent.url;
        runId = run.id;
        sessions.update(chatId, {
          agentId,
          agentUrl,
          runId,
          lastStatus: run.status,
        });
      } else {
        const run = await cursor.createRun({ agentId: agentId!, text: prompt });
        runId = run.id;
        sessions.update(chatId, { runId, lastStatus: run.status, agentUrl });
      }

      if (!runId) {
        throw new Error("Cursor did not return a run id");
      }

      console.log(`chat ${chatId}: agent=${agentId} run=${runId}`);
      heartbeat.stop();

      await editOrSendStatus(
        [
          `Status: ${sessions.get(chatId)?.lastStatus || "CREATING"}`,
          agentUrl ? `Agent: ${agentUrl}` : "",
          "Streaming updates…",
        ]
          .filter(Boolean)
          .join("\n"),
      );

      const finished = await cursor.watchRun(agentId!, runId!, {
        onEvent: async (event: StreamEvent) => {
          if (event.type === "status") {
            sessions.update(chatId, { lastStatus: event.status });
            await editOrSendStatus(
              [
                `Status: ${event.status}`,
                agentUrl ? `Agent: ${agentUrl}` : "",
                lastTool ? `Last tool: ${lastTool}` : "Streaming updates…",
              ]
                .filter(Boolean)
                .join("\n"),
            );
          } else if (event.type === "tool_call") {
            lastTool = `${event.name} (${event.status})`;
            await editOrSendStatus(
              [
                `Status: RUNNING`,
                `Tool: ${lastTool}`,
                agentUrl ? `Agent: ${agentUrl}` : "",
              ]
                .filter(Boolean)
                .join("\n"),
            );
          } else if (event.type === "assistant") {
            assistantBuffer += event.text;
            await flushDraft(false);
          } else if (event.type === "result") {
            sessions.update(chatId, { lastStatus: event.status });
            if (event.text) assistantBuffer = event.text;
          }
        },
      });

      await flushDraft(true);
      sessions.update(chatId, { lastStatus: finished.status });

      const bits = [
        `Status: ${finished.status}`,
        finished.result || assistantBuffer
          ? `\n${finished.result || assistantBuffer}`
          : "\n(No text result — open the agent URL for details.)",
        agentUrl ? `\nAgent: ${agentUrl}` : "",
      ];

      const branch = finished.git?.branches?.[0];
      if (branch?.branch) bits.push(`Branch: ${branch.branch}`);
      if (branch?.prUrl) bits.push(`PR: ${branch.prUrl}`);

      const finalText = truncate(bits.filter(Boolean).join("\n"));
      if (draftMessageId) {
        try {
          await bot.api.editMessageText(chatId, draftMessageId, finalText);
        } catch {
          await bot.api.sendMessage(chatId, finalText);
        }
      } else {
        await bot.api.sendMessage(chatId, finalText);
      }

      try {
        if (statusMessageId) {
          await bot.api.editMessageText(
            chatId,
            statusMessageId,
            `Done (${finished.status})${finished.durationMs ? ` · ${Math.round(finished.durationMs / 1000)}s` : ""}`,
          );
        }
      } catch {
        // ignore edit races
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`chat ${chatId} error:`, message);
      sessions.update(chatId, { lastStatus: "ERROR" });
      await bot.api.sendMessage(chatId, `Error: ${message}`);
    } finally {
      heartbeat.stop();
      busyChats.delete(chatId);
    }
  }

  function startHeartbeat(chatId: number, tick: (seconds: number) => Promise<void>) {
    const started = Date.now();
    let stopped = false;
    const timer = setInterval(() => {
      if (stopped) return;
      const seconds = Math.round((Date.now() - started) / 1000);
      void tick(seconds).catch((err) => console.warn("heartbeat failed", err));
    }, 12_000);
    // First tick soon so the user isn't staring at silence during createAgent.
    setTimeout(() => {
      if (!stopped) void tick(Math.round((Date.now() - started) / 1000)).catch(() => {});
    }, 8_000);
    return {
      stop() {
        stopped = true;
        clearInterval(timer);
      },
    };
  }

  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Telegram error for update ${ctx.update.update_id}`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Grammy error:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Telegram HTTP error:", e);
    } else {
      console.error("Unknown error:", e);
    }
  });

  return bot;
}
