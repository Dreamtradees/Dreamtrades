import { Bot, GrammyError, HttpError } from "grammy";
import type { AppConfig } from "./config.js";
import type { CursorClient } from "./cursor-client.js";
import type { SessionStore } from "./session-store.js";

function isAllowed(config: AppConfig, userId: number | undefined): boolean {
  if (!userId) return false;
  if (config.telegramAllowedUserIds.length === 0) {
    // Open allowlist is only OK in mock mode; live mode requires an allowlist.
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

  // In mock mode without a token, use a placeholder bot that never polls.
  const token = config.telegramBotToken || "000000000:MOCK_TOKEN_FOR_DASHBOARD_ONLY";
  const bot = new Bot(token);

  bot.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!isAllowed(config, userId)) {
      if (ctx.chat && ctx.message) {
        await ctx.reply(
          "This bot is locked to an allowlist. Set TELEGRAM_ALLOWED_USER_IDS to your Telegram user ID (from @userinfobot).",
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
    await runPrompt(ctx.chat.id, ctx.from!.id, prompt, true);
  });

  bot.on("message:text", async (ctx) => {
    if (ctx.message.text.startsWith("/")) return;
    await runPrompt(ctx.chat.id, ctx.from!.id, ctx.message.text, false);
  });

  async function runPrompt(
    chatId: number,
    userId: number,
    prompt: string,
    forceNew: boolean,
  ) {
    const session = sessions.upsert(chatId, userId, {
      repoUrl: config.cursorDefaultRepo,
      startingRef: config.cursorDefaultRef,
      modelId: config.cursorDefaultModel,
    });

    try {
      await bot.api.sendMessage(chatId, forceNew || !session.agentId ? "Starting agent…" : "Sending follow-up…");

      let agentId = session.agentId;
      let agentUrl = session.agentUrl;
      let runId = session.runId;

      if (forceNew || !agentId) {
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
        const run = await cursor.createRun({ agentId, text: prompt });
        runId = run.id;
        sessions.update(chatId, { runId, lastStatus: run.status });
      }

      const finished = await cursor.waitForRun(agentId!, runId!);
      sessions.update(chatId, { lastStatus: finished.status });

      const bits = [
        `Status: ${finished.status}`,
        finished.result ? `\n${finished.result}` : "",
        agentUrl ? `\nAgent: ${agentUrl}` : "",
      ];

      const branch = finished.git?.branches?.[0];
      if (branch?.branch) bits.push(`Branch: ${branch.branch}`);
      if (branch?.prUrl) bits.push(`PR: ${branch.prUrl}`);

      await bot.api.sendMessage(chatId, truncate(bits.filter(Boolean).join("\n")));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      sessions.update(chatId, { lastStatus: "ERROR" });
      await bot.api.sendMessage(chatId, `Error: ${message}`);
    }
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
