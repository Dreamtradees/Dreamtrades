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
4. **Environment variables** (Project → Settings → Environment Variables):

   **Join links (optional):** VIP/WhatsApp/Discord/Instagram URLs ship from `src/lib/site.ts`. Override only if you want to change links without a code deploy:
   - `NEXT_PUBLIC_TELEGRAM_VIP_URL`
   - `NEXT_PUBLIC_WHATSAPP_GROUP_URL`
   - `NEXT_PUBLIC_DISCORD_URL`
   - `NEXT_PUBLIC_INSTAGRAM_URL`

   **Graduation claims (required for “Count me in”):**
   - `TELEGRAM_BOT_TOKEN` — bot token from [@BotFather](https://t.me/BotFather)
   - `TELEGRAM_OWNER_CHAT_ID` — your numeric Telegram user id (the bot DMs you here)
   - `ADMIN_SECRET` — long random string; unlocks `/admin/completions?key=…`

   **Durable graduate count (optional, free tier):**
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`  
   Without Upstash, each claim still DMs you on Telegram; the admin counter is in-memory only and can reset on cold starts.

5. Click **Deploy**.
6. Optional: Project → **Settings → Domains** → add a custom domain.
7. Share the starter pack with your community:

```text
https://YOUR_DEPLOYMENT_URL/learn
```

Example shape after deploy: `https://dreamtrades-….vercel.app/learn`

Admin graduates list:

```text
https://YOUR_DEPLOYMENT_URL/admin/completions?key=YOUR_ADMIN_SECRET
```

### CLI (optional)

```bash
cd dreamtrades
npx vercel login          # once
npx vercel                # preview
npx vercel --prod         # production
```

If the CLI says you are logged out, log in once — config and docs still apply; you can use the dashboard flow above instead.

## Run locally

```bash
cd dreamtrades
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
- `/admin/completions?key=…` — private list + graduate count (needs `ADMIN_SECRET`)
- `POST /api/completions` — graduation claim form submit
- `GET /api/completions/stats` — public graduate count (no contact details)

## Graduation claims (how it works)

When a learner ticks every checklist box, the graduation panel shows community QRs **and** a short “get counted” form (name optional, Telegram **and** WhatsApp both required, optional note, consent).

1. They submit → `POST /api/completions` validates the fields.
2. DreamTrades DMs **you** on Telegram with a neat message (name, @username, WhatsApp, note, timestamp, graduate #).
3. Contact details are also stored in Upstash Redis when configured — so `/admin/completions` lists them neatly.
4. The learner sees: **You’re counted — we’ll reach out.**

**Reach out:** open the Telegram DM (or admin list) and message them on Telegram or WhatsApp if one channel doesn’t reply.

### Telegram setup (one-time)

1. Message [@BotFather](https://t.me/BotFather) → `/newbot` (or reuse an existing bot) → copy the token into `TELEGRAM_BOT_TOKEN`.
2. Start a chat with your bot (press Start).
3. Get your numeric chat id (`TELEGRAM_OWNER_CHAT_ID`) — e.g. message [@userinfobot](https://t.me/userinfobot), or any “get my id” bot.
4. Set both vars + `ADMIN_SECRET` in Vercel → Redeploy.
5. Optional: create a free [Upstash Redis](https://upstash.com/) database → paste REST URL + token for a lasting graduate count.

## What it teaches

1. What a trade is (entry, exit, risk — not a tip feed)
2. Long vs short with an interactive demo
3. How pairs like XAUUSD and EURUSD are quoted (with a live chart example)
4. Candlestick basics (OHLC)
5. Supply & demand — buyers lift, sellers press, simple zones
6. Risk: stop loss, position size, survivable money
7. A before-you-click checklist

Not financial advice. Markets involve risk.
