import { Hono } from "hono";
import { connectionStatus, type AppConfig } from "./config.js";
import type { SessionStore } from "./session-store.js";

export function createWebApp(config: AppConfig, sessions: SessionStore) {
  const app = new Hono();

  app.get("/api/status", (c) => {
    return c.json({
      ...connectionStatus(config),
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
    const status = connectionStatus(config);
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
      --paper: #f3efe4;
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
    .shell {
      max-width: 920px;
      margin: 0 auto;
      padding: 4.5rem 1.25rem 3rem;
    }
    .brand {
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(2.4rem, 6vw, 4.2rem);
      line-height: 0.95;
      letter-spacing: -0.03em;
      margin: 0 0 0.75rem;
    }
    .lede {
      max-width: 36rem;
      color: var(--muted);
      font-size: 1.05rem;
      line-height: 1.55;
      margin: 0 0 2rem;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.45rem 0.8rem;
      border: 1px solid color-mix(in srgb, var(--leaf) 35%, transparent);
      background: color-mix(in srgb, white 55%, transparent);
      backdrop-filter: blur(6px);
      margin-bottom: 1.75rem;
    }
    .dot {
      width: 0.65rem;
      height: 0.65rem;
      border-radius: 50%;
      background: ${status.ready ? "var(--leaf)" : "#b7791f"};
      box-shadow: 0 0 0 6px var(--glow);
    }
    .grid {
      display: grid;
      gap: 1.25rem;
      grid-template-columns: 1.2fr 0.8fr;
    }
    @media (max-width: 800px) {
      .grid { grid-template-columns: 1fr; }
      .shell { padding-top: 2.5rem; }
    }
    section {
      padding: 1.25rem 0 0.25rem;
    }
    h2 {
      font-family: Fraunces, Georgia, serif;
      font-size: 1.35rem;
      margin: 0 0 0.75rem;
    }
    ol {
      margin: 0;
      padding-left: 1.2rem;
      color: var(--muted);
      line-height: 1.6;
    }
    ol li { margin-bottom: 0.55rem; }
    code, .mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.92em;
    }
    .panel {
      border-top: 1px solid color-mix(in srgb, var(--sand) 80%, var(--ink));
      padding-top: 1rem;
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.55rem 0;
      border-bottom: 1px dashed color-mix(in srgb, var(--sand) 70%, transparent);
      color: var(--muted);
      font-size: 0.95rem;
    }
    .row strong { color: var(--ink); font-weight: 600; }
    .cta {
      display: inline-block;
      margin-top: 1.25rem;
      padding: 0.8rem 1.15rem;
      background: var(--leaf-deep);
      color: #f6f3ea;
      text-decoration: none;
      font-weight: 600;
      letter-spacing: 0.01em;
      transition: transform 160ms ease, background 160ms ease;
    }
    .cta:hover { transform: translateY(-1px); background: var(--leaf); }
    .fade-in {
      animation: rise 700ms ease both;
    }
    .fade-in-delay {
      animation: rise 900ms 120ms ease both;
    }
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
        status.ready
          ? "Live — Telegram bot is connected"
          : "Mock mode — add tokens to connect your Telegram"
      }</p>
      <h1 class="brand">Telegram ↔ Cursor</h1>
      <p class="lede">
        Chat with Cursor Cloud Agents from Telegram. Create a bot, drop in your
        tokens, and message tasks from your phone.
      </p>
    </div>

    <div class="grid fade-in-delay">
      <section>
        <h2>Connect your Telegram</h2>
        <ol>
          <li>Open Telegram and message <strong>@BotFather</strong> → <span class="mono">/newbot</span>. Copy the bot token.</li>
          <li>Message <strong>@userinfobot</strong> and copy your numeric user ID.</li>
          <li>Create a Cursor API key at <span class="mono">cursor.com/dashboard/api</span>.</li>
          <li>Copy <span class="mono">.env.example</span> to <span class="mono">.env</span> and fill:
            <br /><span class="mono">TELEGRAM_BOT_TOKEN</span>,
            <span class="mono">TELEGRAM_ALLOWED_USER_IDS</span>,
            <span class="mono">CURSOR_API_KEY</span>,
            <span class="mono">CURSOR_DEFAULT_REPO</span>.
          </li>
          <li>Restart with <span class="mono">npm run dev</span>, then send <span class="mono">/start</span> to your bot.</li>
        </ol>
        <a class="cta" href="/api/status">View JSON status</a>
      </section>

      <section class="panel">
        <h2>Bridge status</h2>
        <div class="row"><span>Mode</span><strong>${status.mode}</strong></div>
        <div class="row"><span>Telegram token</span><strong>${status.telegram.configured ? "set" : "missing"}</strong></div>
        <div class="row"><span>Allowlist</span><strong>${
          status.telegram.allowlistSize
            ? `${status.telegram.allowlistSize} user(s)`
            : status.mode === "mock"
              ? "open (mock only)"
              : "required"
        }</strong></div>
        <div class="row"><span>Cursor API key</span><strong>${status.cursor.configured ? "set" : "missing"}</strong></div>
        <div class="row"><span>Default repo</span><strong class="mono">${status.cursor.defaultRepo || "—"}</strong></div>
        <div class="row"><span>Active chats</span><strong id="chat-count">…</strong></div>
      </section>
    </div>
  </main>
  <script>
    async function refresh() {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        document.getElementById("chat-count").textContent = String(data.sessions.length);
      } catch {
        document.getElementById("chat-count").textContent = "—";
      }
    }
    refresh();
    setInterval(refresh, 4000);
  </script>
</body>
</html>`;
    return c.html(html);
  });

  return app;
}
