# Telegram ↔ Cursor

Connect your Telegram account to [Cursor Cloud Agents](https://cursor.com/docs/cloud-agent/api/endpoints). Message a bot on your phone to create agents, send follow-ups, and get results back in chat.

Cursor itself has **no native Telegram integration**. This bridge is the connection: Telegram bot → this service → Cursor Cloud Agents API.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open the dashboard: [http://127.0.0.1:43127](http://127.0.0.1:43127)

Without tokens the server runs in **mock mode** so you can verify the UI. Add credentials to go live.

## Connect your Telegram (live)

1. In Telegram, open **@BotFather** → `/newbot` → copy the bot token into `TELEGRAM_BOT_TOKEN`.
2. Create a Cursor API key at [cursor.com/dashboard/api](https://cursor.com/dashboard/api) → `CURSOR_API_KEY`.
3. Set `CURSOR_DEFAULT_REPO` to a GitHub repo your Cursor account can access.
4. Restart `npm run dev`, then message your bot `/whoami` — it replies with your numeric user ID (you do **not** need `@userinfobot`).
5. Put that ID in `TELEGRAM_ALLOWED_USER_IDS`, restart again, then send `/start`.

If you still want a third-party ID bot, try `@RawDataBot` or `@getidsbot` instead of `@userinfobot`.

## Bot commands

| Command | Action |
| --- | --- |
| `/start` | Connect this chat and show help |
| `/whoami` | Show your Telegram user ID (works before allowlist) |
| `/status` | Show active agent, repo, and last run |
| `/repo <url> [branch]` | Set the repo agents work on |
| `/new <prompt>` | Start a fresh Cloud Agent |
| `/cancel` | Cancel the active run |
| `/reset` | Forget the active agent |
| _(plain text)_ | Follow up on the active agent, or start one |

## Environment

See `.env.example` for the full list. Important:

- `TELEGRAM_BOT_TOKEN` — from BotFather
- `TELEGRAM_ALLOWED_USER_IDS` — required in live mode (comma-separated)
- `CURSOR_API_KEY` — Cursor dashboard API key
- `CURSOR_DEFAULT_REPO` / `CURSOR_DEFAULT_REF` — default git target
- `MOCK_MODE=1` — force mock Cursor responses even with tokens set
- `PORT` — defaults to `43127`

## How it works

1. Telegram long-polling receives your message.
2. The bridge calls `POST /v1/agents` (or `/v1/agents/{id}/runs` for follow-ups).
3. It polls the run until `FINISHED` / `ERROR` / `CANCELLED`.
4. The run `result` (and PR/branch links when present) is sent back to Telegram.

Sessions are stored in `data/sessions.json` so each Telegram chat keeps its active agent.
