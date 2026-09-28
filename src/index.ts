import { serve } from "@hono/node-server";
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import localtunnel from "localtunnel";
import { loadConfig, connectionStatus, tradingViewWebhookUrl } from "./config.js";
import { LiveCursorClient, MockCursorClient } from "./cursor-client.js";
import { SessionStore } from "./session-store.js";
import { AlertStore } from "./alert-store.js";
import { createTelegramBot } from "./telegram-bot.js";
import { createWebApp } from "./web.js";
import { registerTradingViewRoutes } from "./tradingview.js";

type MutableConfig = ReturnType<typeof loadConfig>;

function persistPublicBaseUrl(url: string) {
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
}

async function tunnelStillWorks(baseUrl: string, secret?: string) {
  if (!secret) return false;
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/webhooks/tradingview/${secret}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "bypass-tunnel-reminder": "1",
      },
      body: JSON.stringify({
        ticker: "TUNNELCHECK",
        action: "ping",
        message: "tunnel health check",
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { ok?: boolean };
    return Boolean(json.ok);
  } catch {
    return false;
  }
}

function openCloudflaredTunnel(port: number): Promise<string> {
  const binCandidates = ["/tmp/cloudflared", "cloudflared"];
  const bin = binCandidates.find((p) => p === "cloudflared" || existsSync(p));
  if (!bin) {
    return Promise.reject(new Error("cloudflared binary not found"));
  }

  return new Promise((resolve, reject) => {
    const child = spawn(bin, ["tunnel", "--url", `http://127.0.0.1:${port}`], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error("cloudflared timed out waiting for URL"));
      }
    }, 30_000);

    const onData = (buf: Buffer) => {
      const text = buf.toString();
      process.stdout.write(text);
      const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
      if (match && !settled) {
        settled = true;
        clearTimeout(timer);
        resolve(match[0]);
      }
    };

    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("error", (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(err);
      }
    });
    child.on("exit", (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error(`cloudflared exited early (code ${code})`));
      }
    });
  });
}

async function openLocaltunnel(port: number): Promise<string> {
  const tunnel = await localtunnel({ port });
  tunnel.on("close", () => console.warn("localtunnel closed"));
  tunnel.on("error", (err: Error) => console.warn("localtunnel error:", err.message));
  return tunnel.url;
}

async function ensurePublicUrl(config: MutableConfig, port: number) {
  if (config.publicBaseUrl) {
    const ok = await tunnelStillWorks(config.publicBaseUrl, config.tradingViewWebhookSecret);
    if (ok) {
      console.log(`Reusing public tunnel: ${config.publicBaseUrl}`);
      return config.publicBaseUrl;
    }
    console.warn(`Stored PUBLIC_BASE_URL is dead (${config.publicBaseUrl}); opening a new tunnel…`);
  }

  console.log("Opening public tunnel for TradingView webhooks…");
  try {
    const url = await openCloudflaredTunnel(port);
    console.log(`Public tunnel (cloudflared): ${url}`);
    persistPublicBaseUrl(url);
    return url;
  } catch (err) {
    console.warn("cloudflared tunnel failed, trying localtunnel:", err);
  }

  try {
    const url = await openLocaltunnel(port);
    console.log(`Public tunnel (localtunnel): ${url}`);
    persistPublicBaseUrl(url);
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

  // Placeholder notifier until Telegram bot is created; replaced below.
  let notifyTradingViewAlert = async (summary: string, raw: unknown) => {
    console.warn("TradingView alert before Telegram ready:", summary, raw);
  };

  const getConfig = () => config;
  const app = createWebApp(getConfig, sessions, alerts);
  registerTradingViewRoutes(app, getConfig, alerts, {
    notifyTradingViewAlert: (summary, raw) => notifyTradingViewAlert(summary, raw),
  });

  await new Promise<void>((resolve) => {
    serve(
      {
        fetch: app.fetch,
        port: config.port,
        hostname: config.host,
      },
      () => resolve(),
    );
  });

  const publicUrl = await ensurePublicUrl(config, config.port);
  if (publicUrl) {
    config = { ...config, publicBaseUrl: publicUrl };
  }
  const status = connectionStatus(config);

  console.log(`Dashboard: http://127.0.0.1:${config.port}`);
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

  const telegram = config.telegramBotToken
    ? createTelegramBot(config, cursor, sessions, alerts)
    : null;

  if (telegram) {
    notifyTradingViewAlert = telegram.notifyTradingViewAlert;
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

    if (webhook) {
      await telegram.notifyTradingViewAlert(
        `Webhook URL ready (no trailing slash/backslash):\n${webhook}`,
        {
          message:
            "Paste this exact URL into TradingView Alert → Notifications → Webhook URL. Do not add \\ at the end.",
        },
      );
    }
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
