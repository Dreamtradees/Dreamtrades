# DreamTrades

Standalone teaching site for the **DreamTrades** trading group.

**Positioning:** teach how to actually trade — not how to take signals. Plain-English fundamentals for newbies.

## Deploy on Vercel (permanent public URL)

This app is ready for Vercel with **Root Directory = `dreamtrades`**.

### Click-through (recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and sign in (GitHub is fine).
2. **Import** this repository.
3. In project settings before deploy:
   - **Framework Preset:** Next.js (auto-detected from `vercel.json`)
   - **Root Directory:** `dreamtrades` ← required (do not leave blank / repo root)
   - **Build Command:** `npm run build` (default)
   - **Install Command:** `npm install` (default)
   - **Output Directory:** leave default (Next.js handles this)
4. **Environment variables** (Project → Settings → Environment Variables) — add for Production (and Preview if you want):

   **Join links (optional):** VIP/WhatsApp/Discord/Instagram URLs ship from `src/lib/site.ts`. Override only if you want to change links without a code deploy:
   - `NEXT_PUBLIC_TELEGRAM_VIP_URL`
   - `NEXT_PUBLIC_WHATSAPP_GROUP_URL`
   - `NEXT_PUBLIC_DISCORD_URL`
   - `NEXT_PUBLIC_INSTAGRAM_URL`

   **Graduation claims — Telegram notify (required for DMs):**
   - `TELEGRAM_BOT_TOKEN` — from [@BotFather](https://t.me/BotFather)
   - `TELEGRAM_OWNER_CHAT_ID` — your numeric Telegram user id (see setup below)
   - `ADMIN_SECRET` — long random string; unlocks `/admin/completions?key=…`

   **Durable leads (strongly recommended on Vercel):**
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`  
   Or, if you used Vercel Marketplace / Vercel KV: `KV_REST_API_URL` + `KV_REST_API_TOKEN` (same thing).

5. Click **Deploy** (or Redeploy after adding env vars).
6. Optional: Project → **Settings → Domains** → add a custom domain.
7. Share the starter pack:

```text
https://YOUR_DEPLOYMENT_URL/learn
```

Admin graduates list:

```text
https://YOUR_DEPLOYMENT_URL/admin/completions?key=YOUR_ADMIN_SECRET
```

### Upstash free setup (durable count + lead table)

Without Redis, Telegram DMs still work, but the admin list/count can reset on Vercel cold starts. Do this once (≈2 minutes):

1. Create a free account at [upstash.com](https://upstash.com/).
2. **Create Database** → Redis → pick the free tier → region closest to your Vercel project.
3. Open the database → **REST API** tab.
4. Copy:
   - **UPSTASH_REDIS_REST_URL**
   - **UPSTASH_REDIS_REST_TOKEN**
5. Paste both into Vercel → Project → Settings → Environment Variables → Production.
6. **Redeploy** the project.
7. Open `/admin/completions?key=…` — Setup should show “Upstash Redis connected”.

Alternative: In Vercel → Storage → create **Upstash Redis** / KV — it usually injects `KV_REST_API_URL` + `KV_REST_API_TOKEN` automatically (DreamTrades accepts those names too).

### Telegram notify setup (one-time)

1. Message [@BotFather](https://t.me/BotFather) → `/newbot` (or reuse a bot) → copy the token into `TELEGRAM_BOT_TOKEN`.
2. Open your new bot in Telegram and press **Start**.
3. Get your numeric chat id for `TELEGRAM_OWNER_CHAT_ID`:
   - Message [@userinfobot](https://t.me/userinfobot) → copy the **Id** number, **or**
   - With `TELEGRAM_BOT_TOKEN` + `ADMIN_SECRET` already on Vercel, message your bot, then open:
     `https://YOUR_URL/api/completions/telegram-setup?key=YOUR_ADMIN_SECRET`  
     and copy your `chatId` from the JSON.
4. Set `TELEGRAM_OWNER_CHAT_ID` + `ADMIN_SECRET` in Vercel → Redeploy.
5. Optional smoke test: `POST` the same `telegram-setup` URL (e.g. with curl) — you should get a test DM.

### CLI (optional)

```bash
cd dreamtrades
npx vercel login          # once
npx vercel                # preview
npx vercel --prod         # production
```

## Run locally

```bash
cd dreamtrades
cp .env.example .env.local   # fill secrets
npm install
npm run build
npm run start -- -p 43129 -H 0.0.0.0
```

Or from the repo root:

```bash
npm run start:dreamtrades
```

Open [http://127.0.0.1:43129](http://127.0.0.1:43129)

## Routes

- `/` — DreamTrades brand landing, why this path exists, and a live XAUUSD desk
- `/learn` — seven-step interactive curriculum + advanced live gold chart (**community starter pack**)
- `/#live-gold` — homepage live XAUUSD TradingView chart (study tool)
- `/learn#live-gold` — full advanced chart next to the curriculum
- `/admin/completions?key=…` — private leads table + graduate count (needs `ADMIN_SECRET`)
- `POST /api/completions` — graduation claim form submit
- `GET /api/completions/stats` — public graduate count (no contact details)
- `GET|POST /api/completions/telegram-setup?key=…` — discover chat id / send test DM

## Graduation claims (how it works)

When a learner ticks every checklist box, the graduation panel shows community QRs **and** a short “get counted” form (name optional, Telegram **and** WhatsApp both required, optional note, consent).

1. They submit → `POST /api/completions` validates the fields.
2. Lead is stored (Upstash Redis when configured) with name, Telegram, WhatsApp, note, timestamp, id — count increments permanently.
3. DreamTrades DMs **you** on Telegram with graduate # and contact details (best-effort; a notify blip does not fail the learner’s submit).
4. The learner sees: **You’re counted — we’ll contact you.**

**Reach out:** open the Telegram DM (or admin table) and message them on Telegram or WhatsApp.

## What it teaches

1. What a trade is (entry, exit, risk — not a tip feed)
2. Long vs short with an interactive demo
3. How pairs like XAUUSD and EURUSD are quoted (with a live chart example)
4. Candlestick basics (OHLC)
5. Supply & demand — buyers lift, sellers press, simple zones
6. Risk: stop loss, position size, survivable money
7. A before-you-click checklist

Not financial advice. Markets involve risk.
