# Baz Trades

Attention-first trading education site — fundamentals, not signal-copying.
Seven-step floor → checklist → claim your seat (leads + optional Telegram notify).

## Run locally

```bash
cd baztrades
npm install
COMPLETIONS_ALLOW_MEMORY=1 TELEGRAM_NOTIFY_MOCK=1 npm run dev
```

Open [http://127.0.0.1:43321](http://127.0.0.1:43321)

- Home: gold-floor hero → Why Baz → live XAUUSD desk  
- Curriculum: [/learn](http://127.0.0.1:43321/learn)  
- Admin leads: `/admin/completions?key=YOUR_ADMIN_SECRET`

## Stack

Next.js 16 · React 19 · Tailwind 4 · TradingView embed · optional Upstash Redis + Telegram Bot API

## Deploy (Vercel)

1. Import this folder as a Vercel project (Root Directory: `baztrades`).
2. Set env vars from `.env.example` (Telegram + Admin + Upstash for production claims).
3. Add community invite URLs via `NEXT_PUBLIC_*` when ready.
4. Redeploy after changing env.

## Brand notes

Baz Trades uses a gold-floor visual system (Archivo Black + Sora + IBM Plex Mono) —
distinct from DreamTrades’ teal photo hero. Same teaching spine; different energy.
