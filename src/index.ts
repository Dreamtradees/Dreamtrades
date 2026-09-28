import { serve } from "@hono/node-server";
import { loadConfig, connectionStatus, tradingViewWebhookUrl } from "./config.js";
import { LiveCursorClient, MockCursorClient } from "./cursor-client.js";
import { SessionStore } from "./session-store.js";
import { AlertStore } from "./alert-store.js";
import { createTelegramBot } from "./telegram-bot.js";
import { createWebApp } from "./web.js";
import { registerTradingViewRoutes } from "./tradingview.js";
import localtunnel from "localtunnel";
import { writeFileSync, readFileSync } from "node:fs";

async function ensurePublicUrl(config: ReturnType<typeof loadConfig>, port: number) {
  if (config.publicBaseUrl) return config.publicBaseUrl;
  try {
    console.log("Opening public tunnel for TradingView webhooks…");
    const tunnel = await localtunnel({ port });
    const url = tunnel.url;
    console.log(`Public tunnel: ${url}`);
    // Persist for this process + .env convenience (not committed).
    process.env.PUBLIC_BASE_URL = url;
    try {
      const envPath = "/workspace/.env";
      let envText = readFileSync(envPath, "utf8");
      if (/^PUBLIC_BASE_URL=/m.test(envText)) {
        envText = envText.replace(/^PUBLIC_BASE_URL=.*$/m, `PUBLIC_BASE_URL=${url}`);
      } else {
        envText += `\nPUBLIC_BASE_URL=${url}\n`;
      }
      writeFileSync(envPath, envText);
    } catch (err) {
      console.warn("Could not persist PUBLIC_BASE_URL to .env:", err);
    }
    tunnel.on("close", () => console.warn("Public tunnel closed"));
    tunnel.on("error", (err: Error) => console.warn("Tunnel error:", err.message));
    return url;
  } catch (err) {
    console.warn("Could not open public tunnel (TradingView needs a public HTTPS URL):", err);
    return undefined;
  }
}

async function main() {
  let config = loadConfig();
  const sessions = new SessionStore();
  const alerts = new AlertStore();
  const cursor = config.mockMode
    ? new MockCursorClient()
    : new LiveCursorClient(config.cursorApiKey!, config.cursorApiBase);

  const publicUrl = await ensurePublicUrl(config, config.port);
  if (publicUrl) {
    config = { ...config, publicBaseUrl: publicUrl };
  }
  const status = connectionStatus(config);

  const telegram = config.telegramBotToken
    ? createTelegramBot(config, cursor, sessions, alerts)
    : null;

  const app = createWebApp(config, sessions, alerts);
  registerTradingViewRoutes(app, config, alerts, {
    notifyTradingViewAlert: async (summary, raw) => {
      if (!telegram) {
        console.warn("TradingView alert received but Telegram bot is offline");
        return;
      }
      await telegram.notifyTradingViewAlert(summary, raw);
    },
  });

  serve(
    {
      fetch: app.fetch,
      port: config.port,
      hostname: config.host,
    },
    (info) => {
      console.log(`Dashboard: http://127.0.0.1:${info.port}`);
      console.log(`Mode: ${status.mode}`);
      console.log(
        `Telegram: ${status.telegram.configured ? "token set" : "missing"} | Cursor: ${
          status.cursor.configured ? "key set" : "missing"
        }`,
      );
      const webhook = tradingViewWebhookUrl(config);
      if (webhook) {
        console.log(`TradingView webhook: ${webhook}`);
      } else {
        console.log("TradingView webhook: waiting for PUBLIC_BASE_URL + secret");
      }
    },
  );

  if (telegram) {
    if (config.mockMode) {
      console.log("Cursor is in mock mode — Telegram will reply with simulated agent results.");
    }
    if (!config.mockMode && config.telegramAllowedUserIds.length === 0) {
      console.warn(
        "TELEGRAM_ALLOWED_USER_IDS is empty — bot will only answer /whoami until you set an allowlist.",
      );
    }
    console.log("Starting Telegram long polling…");
    telegram.bot.start({
      onStart: (info) => {
        console.log(`Telegram bot @${info.username} is online`);
      },
    });
  } else {
    console.log(
      "Telegram polling idle — set TELEGRAM_BOT_TOKEN + CURSOR_API_KEY in .env to connect live.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
