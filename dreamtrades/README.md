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
4. **Environment variables:** none required. Telegram VIP and WhatsApp join URLs ship from constants in `src/lib/site.ts` and are baked into the client bundle. Optional overrides (only if you want to change links without a code deploy):
   - `NEXT_PUBLIC_TELEGRAM_VIP_URL`
   - `NEXT_PUBLIC_WHATSAPP_GROUP_URL`
5. Click **Deploy**.
6. Optional: Project → **Settings → Domains** → add a custom domain.
7. Share the starter pack with your community:

```text
https://YOUR_DEPLOYMENT_URL/learn
```

Example shape after deploy: `https://dreamtrades-….vercel.app/learn`

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

## What it teaches

1. What a trade is (entry, exit, risk — not a tip feed)
2. Long vs short with an interactive demo
3. How pairs like XAUUSD and EURUSD are quoted (with a live chart example)
4. Candlestick basics (OHLC)
5. Supply & demand — buyers lift, sellers press, simple zones
6. Risk: stop loss, position size, survivable money
7. A before-you-click checklist

Not financial advice. Markets involve risk.
