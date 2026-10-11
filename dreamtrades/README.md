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
4. **Environment variables** — see [Set env vars on Vercel (checklist notify + leads)](#set-env-vars-on-vercel-checklist-notify--leads) below. Add for **Production** and **Preview**, then **Redeploy**.
5. Click **Deploy** (or **Redeploy** after adding/changing env vars — env changes do not apply until redeploy).
6. Optional: Project → **Settings → Domains** → add a custom domain.
7. Share the starter pack:

```text
https://YOUR_DEPLOYMENT_URL/learn
```

Admin graduates / leads list:

```text
https://YOUR_DEPLOYMENT_URL/admin/completions?key=YOUR_ADMIN_SECRET
```

Quick health check (no PII):

```text
https://YOUR_DEPLOYMENT_URL/api/completions/stats
```

You want `"accepting": true`, `"telegramConfigured": true`, and preferably `"redisConfigured": true` / `"durable": true`.

### One-shot production checklist (live site)

Do these in order for [dreamtrades.vercel.app](https://dreamtrades.vercel.app). Root Directory is already `dreamtrades/`.

1. **Telegram bot** — [@BotFather](https://t.me/BotFather) → `/newbot` (or `/token`) → copy token. Open the bot → **Start**.
2. **Your chat id** — message [@userinfobot](https://t.me/userinfobot) → copy numeric **Id** (or discover later via telegram-setup below).
3. **ADMIN_SECRET** — generate once: `openssl rand -hex 24` (keep the hex string private).
4. **Upstash Redis (free)** — [console.upstash.com](https://console.upstash.com/) → Create Redis → **REST API** tab → copy URL + token.
5. **Vercel env** — [Vercel → Dreamtrades → Settings → Environment Variables](https://vercel.com/dashboard) → add all five for **Production** + **Preview**:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_OWNER_CHAT_ID`
   - `ADMIN_SECRET`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
6. **Redeploy** — Deployments → ⋮ on latest Production → **Redeploy**.
7. **Verify** — [stats](https://dreamtrades.vercel.app/api/completions/stats) should show `accepting` / `telegramConfigured` / `redisConfigured` / `durable` all `true`.
8. **Admin + test DM** — open `/admin/completions?key=YOUR_ADMIN_SECRET`, then:
   - Discover chat id: `GET https://dreamtrades.vercel.app/api/completions/telegram-setup?key=YOUR_ADMIN_SECRET`
   - Test DM: `curl -X POST "https://dreamtrades.vercel.app/api/completions/telegram-setup?key=YOUR_ADMIN_SECRET"`

If `TELEGRAM_OWNER_CHAT_ID` was blank in step 5: set bot token + `ADMIN_SECRET` first → Redeploy → message the bot → use the GET URL above → paste `chatId` into Vercel → Redeploy again.

### Set env vars on Vercel (checklist notify + leads)

For the live project ([dreamtrades.vercel.app](https://dreamtrades.vercel.app)), Root Directory is already `dreamtrades/`. Without the vars below, `/learn` claim submits return **503** and you will not get Telegram DMs.

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → project **Dreamtrades** (or whatever you named the import of `Dreamtradees/Dreamtrades`).
2. Go to **Settings → Environment Variables**.
3. Add each variable below. For every row, enable **Production** and **Preview** (Development optional). Leave **Sensitive** on if offered.
4. Click **Save** after each (or bulk-add if your UI allows).
5. Go to **Deployments** → ⋮ on the latest Production deployment → **Redeploy** (do **not** skip the build cache if unsure — a normal Redeploy is fine). Env changes do nothing until a new deployment picks them up.
6. Verify: open [https://dreamtrades.vercel.app/api/completions/stats](https://dreamtrades.vercel.app/api/completions/stats) — target JSON flags:

```json
{
  "accepting": true,
  "telegramConfigured": true,
  "telegramBotConfigured": true,
  "redisConfigured": true,
  "durable": true
}
```

| Variable | Required? | How to get the value |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | **Yes** (for DMs) | Telegram → [@BotFather](https://t.me/BotFather) → `/newbot` (or `/token` on an existing bot) → paste the token. Then open your bot and press **Start** once. |
| `TELEGRAM_OWNER_CHAT_ID` | **Yes** (for DMs) | Easiest: message [@userinfobot](https://t.me/userinfobot) → copy the numeric **Id**. Or: set `TELEGRAM_BOT_TOKEN` + `ADMIN_SECRET`, Redeploy, message your bot, then open `/api/completions/telegram-setup?key=YOUR_ADMIN_SECRET` and copy `chatId`. |
| `ADMIN_SECRET` | **Yes** (for admin) | Generate once: `openssl rand -hex 24`. Paste the hex string. Unlock admin at `/admin/completions?key=…`. If this value was ever pasted into chat/docs, **rotate** it (new random) and update Vercel. |
| `UPSTASH_REDIS_REST_URL` | **Strongly recommended** | [upstash.com](https://upstash.com/) → Create Redis (free) → database → **REST API** tab → copy URL. |
| `UPSTASH_REDIS_REST_TOKEN` | **Strongly recommended** | Same Upstash **REST API** tab → copy token. |

**Aliases accepted** (Vercel Marketplace / Vercel KV): `KV_REST_API_URL` + `KV_REST_API_TOKEN` instead of the `UPSTASH_*` names.

**Suggested order:** create BotFather token + `ADMIN_SECRET` first → Redeploy → discover `TELEGRAM_OWNER_CHAT_ID` → add Upstash URL/token → Redeploy again → confirm `/api/completions/stats`.

**Optional public join-link overrides** (defaults live in `src/lib/site.ts`):

- `NEXT_PUBLIC_TELEGRAM_VIP_URL`
- `NEXT_PUBLIC_WHATSAPP_GROUP_URL`
- `NEXT_PUBLIC_DISCORD_URL`
- `NEXT_PUBLIC_INSTAGRAM_URL`

### Upstash free setup (durable count + lead table)

Without Redis on Vercel, Telegram DMs can still work, but the admin list/count can reset on cold starts (serverless memory is ephemeral). Do this once (≈2 minutes):

1. Create a free account at [upstash.com](https://upstash.com/).
2. **Create Database** → Redis → pick the free tier → region closest to your Vercel project.
3. Open the database → **REST API** tab.
4. Copy:
   - **UPSTASH_REDIS_REST_URL**
   - **UPSTASH_REDIS_REST_TOKEN**
5. Paste both into Vercel → Project → Settings → Environment Variables → **Production**.
6. **Redeploy** the project.
7. Open `/admin/completions?key=…` — Setup should show “Upstash Redis connected”.

Alternative: In Vercel → Storage → create **Upstash Redis** / KV — it usually injects `KV_REST_API_URL` + `KV_REST_API_TOKEN` automatically (DreamTrades accepts those names too).

### Telegram notify setup (one-time)

1. Message [@BotFather](https://t.me/BotFather) → `/newbot` (or reuse a bot) → copy the token into Vercel env `TELEGRAM_BOT_TOKEN`.
2. Open your new bot in Telegram and press **Start** (required once so the bot can message you).
3. Get your numeric chat id for `TELEGRAM_OWNER_CHAT_ID`:
   - Message [@userinfobot](https://t.me/userinfobot) → copy the **Id** number, **or**
   - With `TELEGRAM_BOT_TOKEN` + `ADMIN_SECRET` already on Vercel (and redeployed), message your bot, then open:
     `https://dreamtrades.vercel.app/api/completions/telegram-setup?key=YOUR_ADMIN_SECRET`  
     and copy your `chatId` from the JSON (`chats[].chatId`).
4. Set `TELEGRAM_OWNER_CHAT_ID` + `ADMIN_SECRET` in Vercel → **Redeploy**.
5. Smoke test: `POST` the same `telegram-setup` URL (e.g. with curl) — you should get a test DM:

```bash
curl -X POST "https://dreamtrades.vercel.app/api/completions/telegram-setup?key=YOUR_ADMIN_SECRET"
```

### Local /dev fallbacks (not for production)

When Redis/Telegram secrets are unset locally:

- Leads persist to `dreamtrades/.data/completions.json` (file store; gitignored).
- Set `TELEGRAM_NOTIFY_MOCK=1` to log owner DMs to the server console instead of calling Telegram.
- `COMPLETIONS_ALLOW_MEMORY=1` forces accepting claims without production secrets.

These are for local testing only. On Vercel you need real Telegram + Upstash env vars.

### CLI (optional)

```bash
cd dreamtrades
npx vercel login          # once (browser)
npx vercel link           # link to the existing Dreamtrades project (Root Directory = dreamtrades)
npx vercel env add TELEGRAM_BOT_TOKEN production
npx vercel env add TELEGRAM_BOT_TOKEN preview
# repeat for TELEGRAM_OWNER_CHAT_ID, ADMIN_SECRET,
# UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
npx vercel --prod         # redeploy so new env vars apply
```

Each `vercel env add` prompts for the secret value interactively (do not commit secrets). Dashboard steps above are usually faster.

## Run locally

```bash
cd dreamtrades
cp .env.example .env.local   # fill secrets (or enable MOCK + ALLOW_MEMORY)
npm install
npm run build
npm run start -- -p 43217 -H 0.0.0.0
```

Or from the repo root:

```bash
npm run start:dreamtrades
```

Open [http://127.0.0.1:43217](http://127.0.0.1:43217)

## Routes

- `/` — DreamTrades brand landing, why this path exists, and a live XAUUSD desk
- `/learn` — seven-step interactive curriculum + advanced live gold chart (**community starter pack**)
- `/#live-gold` — homepage live XAUUSD TradingView chart (study tool)
- `/learn#live-gold` — full advanced chart next to the curriculum
- `/admin/completions?key=…` — private leads table + graduate count (needs `ADMIN_SECRET`)
- `/admin/crm?key=…` — DreamTrades lead desk (board, table, dashboard). Same `ADMIN_SECRET`. Owner key only.
- `/admin/crm/scripts?key=…` — follow-up scripts to copy and send by hand
- `/admin/crm/guide?key=…` — how to use the desk
- `POST /api/completions` — graduation claim form submit (stores lead, then Telegram notify)
- `POST /api/leads` — homepage signup (stage New, source Website form, then the same owner Telegram note)
- `GET|POST|PATCH /api/crm?key=…` — owner lead desk API
- `GET /api/completions/stats` — public graduate count (no contact details)
- `GET|POST /api/completions/telegram-setup?key=…` — discover chat id / send test DM

## Graduation claims (how it works)

When a learner ticks every checklist box, the graduation panel shows community QRs **and** a short “get counted” form (name optional, Telegram **and** WhatsApp both required, optional note, consent).

1. They submit → `POST /api/completions` validates the fields (Telegram + WhatsApp required).
2. Lead is stored first (Upstash Redis on Vercel when configured; local file/memory in dev) with name, Telegram, WhatsApp, note, timestamp, id — running count increments.
3. DreamTrades DMs **you** on Telegram with graduate # and contact details (best-effort). If Telegram fails after save, the lead is kept and the admin **Notify** column shows the error.
4. The learner sees: **You’re counted — we’ll contact you.**

**Reach out:** open the Telegram DM (or admin table) and message them on Telegram or WhatsApp.

## DreamTrades lead desk

Private CRM for the DreamTrades book only. Open it with the same owner key as the graduate list:

```text
https://YOUR_DEPLOYMENT_URL/admin/crm?key=YOUR_ADMIN_SECRET
```

No new environment variables. The desk uses the vars you already set:

| Variable | Used for |
|---|---|
| `ADMIN_SECRET` | Unlocks `/admin/crm`, scripts, the guide, and `/api/crm` |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Durable lead records (key `dreamtrades:crm:v1`). Vercel KV aliases work too. |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_OWNER_CHAT_ID` | Owner note when someone uses the homepage form |

Local file fallback (no Redis): `dreamtrades/.data/crm.json`, same rules as the graduate file store.

### What you can do

- **Board** — one column per stage, with a count. Stages: New, Welcomed, Course, Broker account, First deposit, VIP, Active Trader, Lost.
- **Table** — search and filter by stage, follow-up, assignee, and source. Overdue follow-ups are highlighted. Due-today rows are marked too.
- **Drawer** — click a card or row and edit every field. Assignee defaults to `DreamTrades team` (dropdown, or type a desk name).
- **Add a lead** — for someone you already spoke to.
- **Dashboard** — funnel with conversion from the previous stage, overdue and today follow-ups, new leads in the last 7 days, count and total of first deposits.
- **CSV** — exports the rows currently filtered.
- **Scripts** — Welcome, 48 hours with no account, 7 days with no deposit, funded + VIP invite. Copy, then send yourself.
- **How to use** — `/admin/crm/guide?key=…` explains each stage and field.

Nothing on the desk messages a client. The team copies the text and sends it by hand. New homepage signups still notify the owner on Telegram, the same way checklist claims do.

### Homepage signup

The homepage VIP block (`/#vip`) collects name, Telegram, WhatsApp, and consent. It posts to `POST /api/leads`, stores stage **New** and source **Website form**, and sends the owner Telegram note. The form tells the visitor that DreamTrades stores the details and that a person writes back — nothing is sent to them automatically.

### Checklist graduates

Organic checklist claims (no `ref` on the stored record) are copied into the desk the first time you open it, as stage **Course**, source **Checklist graduate**, keeping their original name, Telegram, WhatsApp, note, and created time. Ids are `DT-0001`, `DT-0002`, and so on, oldest first. The graduate list at `/admin/completions` is unchanged. Claims that already carry a `ref` stay on that list and are not copied into this desk.

## What it teaches

1. What a trade is (entry, exit, risk — not a tip feed)
2. Long vs short with an interactive demo
3. How pairs like XAUUSD and EURUSD are quoted (with a live chart example)
4. Candlestick basics (OHLC)
5. Supply & demand — buyers lift, sellers press, simple zones
6. Risk: stop loss, position size, survivable money
7. A before-you-click checklist

Not financial advice. Markets involve risk.

## Affiliates (partner CRM slice)

**SARA TRADING FX** face site (share this — not dreamtrades in the URL):

```text
https://saratradingfx.vercel.app
```

Same app, Sara-branded host. Optional later: buy `saratradingfx.com` and point DNS to Vercel (middleware already allows that host).

1. She shares: `https://saratradingfx.vercel.app` (or `/with/sara` on DreamTrades)
2. Her lead table: `https://dreamtrades.vercel.app/partners/sara?key=HER_SECRET`
3. Team admin (her leads only): `/admin/completions?key=AFFILIATE_SARA_ADMIN_SECRET` — never owner clients
4. Set Vercel env `AFFILIATE_SARA_SECRET` + `AFFILIATE_SARA_ADMIN_SECRET`, Redeploy

Only leads with `ref=sara` appear on Sara’s admin. Your DreamTrades checklist clients stay on your admin only.

### Sara community links (her rooms)

Set on Vercel (Production + Preview) then Redeploy — or paste into `affiliates.ts` → `community`:

```text
NEXT_PUBLIC_SARA_TELEGRAM_VIP_URL=
NEXT_PUBLIC_SARA_WHATSAPP_GROUP_URL=
NEXT_PUBLIC_SARA_DISCORD_URL=
NEXT_PUBLIC_SARA_INSTAGRAM_URL=https://www.instagram.com/sarah.aboutaleb/
```

Her graduates only see **her** QRs — never DreamTrades VIP/WhatsApp.
