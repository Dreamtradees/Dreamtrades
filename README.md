# DreamTrades

Teaching site for **DreamTrades** — how to trade, not how to take signals.

| App | Folder | Port |
| --- | --- | --- |
| **DreamTrades** | `dreamtrades/` | 43129 |

## Deploy (Vercel)

Import this repo on Vercel and set **Root Directory** to `dreamtrades`. No env vars required (join links ship from `dreamtrades/src/lib/site.ts`). After deploy, share **`https://YOUR_URL/learn`** as the community starter pack. Step-by-step: [`dreamtrades/README.md`](dreamtrades/README.md).

## Run

```bash
cd dreamtrades
npm install
npm run build
npm run start -- -p 43129 -H 0.0.0.0
```

Open [http://127.0.0.1:43129](http://127.0.0.1:43129)

- Curriculum: [/learn](http://127.0.0.1:43129/learn)
- Live XAUUSD desk: [/#live-gold](http://127.0.0.1:43129/#live-gold) · [/learn#live-gold](http://127.0.0.1:43129/learn#live-gold)

Includes: markets, long/short, pairs, candles, supply & demand, risk, checklist, and a live TradingView XAUUSD chart for study.

Not financial advice. Markets involve risk.
