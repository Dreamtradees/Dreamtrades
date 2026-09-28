import { serve } from "@hono/node-server";
import { loadConfig, connectionStatus } from "./config.js";
import { LiveCursorClient, MockCursorClient } from "./cursor-client.js";
import { SessionStore } from "./session-store.js";
import { createTelegramBot } from "./telegram-bot.js";
import { createWebApp } from "./web.js";

async function main() {
  const config = loadConfig();
  const status = connectionStatus(config);
  const sessions = new SessionStore();
  const cursor = config.mockMode
    ? new MockCursorClient()
    : new LiveCursorClient(config.cursorApiKey!, config.cursorApiBase);

  const app = createWebApp(config, sessions);

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
    },
  );

  if (config.telegramBotToken) {
    if (config.mockMode) {
      console.log("Cursor is in mock mode — Telegram will reply with simulated agent results.");
    }
    if (!config.mockMode && config.telegramAllowedUserIds.length === 0) {
      console.warn(
        "TELEGRAM_ALLOWED_USER_IDS is empty — bot will only answer /whoami until you set an allowlist.",
      );
    }
    const bot = createTelegramBot(config, cursor, sessions);
    console.log("Starting Telegram long polling…");
    bot.start({
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
