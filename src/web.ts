import { Hono } from "hono";
import { connectionStatus, tradingViewWebhookUrl, type AppConfig } from "./config.js";
import type { SessionStore } from "./session-store.js";
import type { AlertStore } from "./alert-store.js";

export function createWebApp(
  getConfig: () => AppConfig,
  sessions: SessionStore,
  alerts: AlertStore,
) {
  const app = new Hono();

  app.get("/api/status", (c) => {
    const config = getConfig();
    return c.json({
      ...connectionStatus(config),
      tradingViewWebhookUrl: tradingViewWebhookUrl(config),
      tradingViewAlertCount: alerts.count(),
      recentTradingViewAlerts: alerts.list(5),
      sessions: sessions.list().map((s) => ({
        chatId: s.chatId,
        agentId: s.agentId,
        agentUrl: s.agentUrl,
        repoUrl: s.repoUrl,
        lastStatus: s.lastStatus,
        updatedAt: s.updatedAt,
      })),
      serverTime: new Date().toISOString(),
    });
  });

  app.get("/health", (c) => c.json({ ok: true }));

  app.get("/", (c) => {
    const config = getConfig();
    const webhookUrl = tradingViewWebhookUrl(config);
    const status = connectionStatus(config);
    const recent = alerts.list(8);
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Telegram ↔ Cursor</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --ink: #152018;
      --muted: #4d5a50;
      --leaf: #1f6a45;
      --leaf-deep: #0f3d28;
      --sand: #d9c7a3;
      --glow: rgba(31, 106, 69, 0.18);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      color: var(--ink);
      font-family: "IBM Plex Sans", sans-serif;
      background:
        radial-gradient(1200px 600px at 10% -10%, #fff8e8 0%, transparent 55%),
        radial-gradient(900px 500px at 100% 0%, #cfe7d5 0%, transparent 50%),
        linear-gradient(160deg, #efe7d6 0%, #e4ede8 45%, #d5e4da 100%);
    }
    .shell { max-width: 920px; margin: 0 auto; padding: 4.5rem 1.25rem 3rem; }
    .brand {
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(2.4rem, 6vw, 4.2rem);
      line-height: 0.95;
      letter-spacing: -0.03em;
      margin: 0 0 0.75rem;
    }
    .lede { max-width: 36rem; color: var(--muted); font-size: 1.05rem; line-height: 1.55; margin: 0 0 2rem; }
    .status {
      display: inline-flex; align-items: center; gap: 0.55rem;
      padding: 0.45rem 0.8rem;
      border: 1px solid color-mix(in srgb, var(--leaf) 35%, transparent);
      background: color-mix(in srgb, white 55%, transparent);
      backdrop-filter: blur(6px);
      margin-bottom: 1.75rem;
    }
    .dot {
      width: 0.65rem; height: 0.65rem; border-radius: 50%;
      background: ${status.tradingView.webhookReady ? "var(--leaf)" : "#b7791f"};
      box-shadow: 0 0 0 6px var(--glow);
    }
    .grid { display: grid; gap: 1.25rem; grid-template-columns: 1.15fr 0.85fr; }
    @media (max-width: 800px) { .grid { grid-template-columns: 1fr; } .shell { padding-top: 2.5rem; } }
    section { padding: 1.25rem 0 0.25rem; }
    h2 { font-family: Fraunces, Georgia, serif; font-size: 1.35rem; margin: 0 0 0.75rem; }
    ol, ul { margin: 0; padding-left: 1.2rem; color: var(--muted); line-height: 1.6; }
    ol li, ul li { margin-bottom: 0.55rem; }
    code, .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.86em; word-break: break-all; }
    .panel { border-top: 1px solid color-mix(in srgb, var(--sand) 80%, var(--ink)); padding-top: 1rem; }
    .row {
      display: flex; justify-content: space-between; gap: 1rem;
      padding: 0.55rem 0;
      border-bottom: 1px dashed color-mix(in srgb, var(--sand) 70%, transparent);
      color: var(--muted); font-size: 0.95rem;
    }
    .row strong { color: var(--ink); font-weight: 600; }
    .cta, button.cta {
      display: inline-block; margin-top: 1rem; margin-right: 0.5rem;
      padding: 0.8rem 1.15rem; background: var(--leaf-deep); color: #f6f3ea;
      text-decoration: none; font-weight: 600; border: 0; cursor: pointer;
      font-family: inherit; font-size: 0.95rem;
    }
    .cta:hover, button.cta:hover { background: var(--leaf); }
    .webhook {
      margin-top: 0.75rem; padding: 0.85rem;
      background: color-mix(in srgb, white 65%, transparent);
      border: 1px solid color-mix(in srgb, var(--sand) 80%, transparent);
      color: var(--ink); line-height: 1.45;
    }
    .fade-in { animation: rise 700ms ease both; }
    .fade-in-delay { animation: rise 900ms 120ms ease both; }
    @keyframes rise {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <main class="shell">
    <div class="fade-in">
      <p class="status"><span class="dot"></span> ${
        status.tradingView.webhookReady
          ? "TradingView webhooks ready — paste the URL into an alert"
          : "TradingView alerts supported — public URL still connecting"
      }</p>
      <h1 class="brand">Telegram ↔ Cursor</h1>
      <p class="lede">
        Cloud Agents from Telegram, plus TradingView alert webhooks forwarded to your chat.
        This is alert access — not a full TradingView account login.
      </p>
    </div>

    <div class="grid fade-in-delay">
      <section>
        <h2>Connect TradingView</h2>
        <ol>
          <li>Copy the webhook URL below.</li>
          <li>In TradingView, open a chart → <strong>Alert</strong> → Notifications → enable <strong>Webhook URL</strong>.</li>
          <li>Paste the URL and use a JSON message body with your ticker/action/price.</li>
          <li>When the alert fires, this bridge stores it and texts <strong>@DreamtradeesBot</strong>.</li>
        </ol>
        <div class="webhook mono" id="webhook-url">${
          webhookUrl || "Public tunnel starting… refresh in a few seconds."
        }</div>
        <button class="cta" type="button" id="copy-btn">Copy webhook URL</button>
        <button class="cta" type="button" id="test-btn">Send test alert</button>
        <a class="cta" href="/api/tradingview/alerts">Alert JSON</a>
      </section>

      <section class="panel">
        <h2>Bridge status</h2>
        <div class="row"><span>Mode</span><strong>${status.mode}</strong></div>
        <div class="row"><span>Telegram</span><strong>${status.telegram.configured ? "connected" : "missing"}</strong></div>
        <div class="row"><span>Cursor API</span><strong>${status.cursor.configured ? "set" : "missing"}</strong></div>
        <div class="row"><span>TV secret</span><strong>${status.tradingView.configured ? "set" : "missing"}</strong></div>
        <div class="row"><span>TV alerts</span><strong id="alert-count">${alerts.count()}</strong></div>
        <h2 style="margin-top:1.4rem">Recent alerts</h2>
        <ul id="alert-list">
          ${
            recent.length
              ? recent
                  .map(
                    (a) =>
                      `<li><span class="mono">${a.receivedAt.slice(11, 19)}</span> ${escapeHtml(a.summary)}</li>`,
                  )
                  .join("")
              : "<li>No alerts yet</li>"
          }
        </ul>
      </section>
    </div>
  </main>
  <script>
    const webhook = ${JSON.stringify(webhookUrl)};
    document.getElementById("copy-btn").onclick = async () => {
      if (!webhook) return alert("Webhook URL not ready yet");
      await navigator.clipboard.writeText(webhook);
      alert("Copied");
    };
    document.getElementById("test-btn").onclick = async () => {
      const res = await fetch("/api/tradingview/test", { method: "POST" });
      const data = await res.json();
      alert(data.ok ? "Test alert sent to Telegram" : (data.error || "Failed"));
      location.reload();
    };
    async function refresh() {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        document.getElementById("alert-count").textContent = String(data.tradingViewAlertCount || 0);
      } catch {}
    }
    setInterval(refresh, 5000);
  </script>
</body>
</html>`;
    return c.html(html);
  });

  return app;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
