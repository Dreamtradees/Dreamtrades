# Trading education sites

| App | Folder | Local port | Notes |
| --- | --- | --- | --- |
| **DreamTrades** | `dreamtrades/` | 43217 | Teal photo hero · live at dreamtrades.vercel.app |
| **Baz Trades** | `baztrades/` | 43321 | Gold-floor hero · learn path + leads |

Both teach fundamentals (not signal-copying): lessons → checklist → claim seat.

## Baz Trades (local)

```bash
cd baztrades
npm install
COMPLETIONS_ALLOW_MEMORY=1 TELEGRAM_NOTIFY_MOCK=1 npm run dev
```

Open [http://127.0.0.1:43321](http://127.0.0.1:43321) · curriculum: [/learn](http://127.0.0.1:43321/learn)

## DreamTrades (local)

```bash
cd dreamtrades
npm install
npm run dev
```

Open [http://127.0.0.1:43217](http://127.0.0.1:43217)

## Deploy

Import this repo on Vercel twice (or two projects), with **Root Directory** set to `dreamtrades` or `baztrades`. See each folder’s README for env vars (Telegram + Upstash + admin).

Not financial advice. Markets involve risk.
