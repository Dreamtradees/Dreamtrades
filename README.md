# DreamTrades + LJ CIRCLE

Two separate frontends:

| App | Folder | Port | Role |
| --- | --- | --- | --- |
| **DreamTrades** | `dreamtrades/` | 43129 | Teaching product — how to trade, not how to take signals |
| **LJ CIRCLE** | `web/` | 43128 | Friend’s attentive XAUUSD desk + Telegram join QR (`@LJwealthLab`) |

## DreamTrades (teaching site)

```bash
cd dreamtrades
npm install
npm run build
npm run start -- -p 43129 -H 0.0.0.0
```

Open [http://127.0.0.1:43129](http://127.0.0.1:43129)

- `/` — DreamTrades brand landing
- `/learn` — six-step fundamentals curriculum for newbies

See [`dreamtrades/README.md`](dreamtrades/README.md).

## LJ CIRCLE (desk — not the school)

```bash
cd web
npm install
npm run build
npm run start -- -p 43128 -H 0.0.0.0
```

Open [http://127.0.0.1:43128](http://127.0.0.1:43128)

Join QR → [@LJwealthLab](https://t.me/LJwealthLab) via `web/src/lib/site.ts`.

## MetaTrader 5 / Telegram bridge

See [`mt5/README.md`](mt5/README.md). Bridge: `npm run dev` → port 43127.

Not financial advice. Markets involve risk.
