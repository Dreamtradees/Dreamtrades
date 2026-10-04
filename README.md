# DreamTrades + LJ CIRCLE

| App | Folder | Port | Role |
| --- | --- | --- | --- |
| **DreamTrades** | `dreamtrades/` | 43129 | Your teaching product — how to trade, not how to take signals |
| **LJ CIRCLE** | `web/` | 43128 | Friend’s XAUUSD desk + Telegram QR (`@LJwealthLab`) |

## DreamTrades

```bash
cd dreamtrades
npm install
npm run build
npm run start -- -p 43129 -H 0.0.0.0
```

Open [http://127.0.0.1:43129](http://127.0.0.1:43129) · curriculum at [/learn](http://127.0.0.1:43129/learn)

Includes: markets, long/short, pairs, candles, **supply & demand**, risk, checklist.

## LJ CIRCLE

```bash
cd web
npm install
npm run build
npm run start -- -p 43128 -H 0.0.0.0
```

Join QR → https://t.me/LJwealthLab

Not financial advice. Markets involve risk.
