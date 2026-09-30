# DreamTrades

Attentive trading brand site plus a Telegram ↔ Cursor bridge with TradingView alert webhooks.

## DreamTrades website

```bash
cd web
npm install
npm run dev -- --port 43128
```

Open [http://127.0.0.1:43128](http://127.0.0.1:43128)

From the repo root you can also run `npm run dev:web`.

- `/` — brand landing with full-bleed market hero and attention board
- `/watch` — focused watch desk

## Telegram ↔ Cursor bridge

```bash
npm install
cp .env.example .env
npm run dev
```

Open the bridge dashboard: [http://127.0.0.1:43127](http://127.0.0.1:43127)

### Connect Telegram (live)

1. @BotFather → `/newbot` → `TELEGRAM_BOT_TOKEN`
2. Cursor API key → `CURSOR_API_KEY`
3. Restart, message your bot `/whoami`, set `TELEGRAM_ALLOWED_USER_IDS`
4. Send `/start`

### TradingView alerts

TradingView does not offer personal account login for apps. Use alert webhooks:

1. Start the bridge — it opens a public tunnel and prints a webhook URL (or use `/tv` in Telegram)
2. TradingView chart → Alert → Notifications → Webhook URL
3. Alerts forward to your Telegram allowlist

### Bot commands

| Command | Action |
| --- | --- |
| `/start` | Connect this chat |
| `/whoami` | Show Telegram user ID |
| `/tv` | TradingView webhook + recent alerts |
| `/status` | Active agent + repo |
| `/repo <url> [branch]` | Set default repository |
| `/new <prompt>` | Start a Cloud Agent |
| `/cancel` | Cancel active run |
| `/reset` | Forget active agent |
| _(plain text)_ | Follow up or start an agent |
