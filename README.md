# LJ CIRCLE

Attentive trading website for **XAUUSD** and majors — live prices, TradingView charts, Telegram join QR, plus an optional MetaTrader 5 toolkit and Telegram ↔ Cursor bridge.

## LJ CIRCLE website

```bash
cd web
npm install
npm run build
npm run start -- -p 43128 -H 0.0.0.0
```

Open [http://127.0.0.1:43128](http://127.0.0.1:43128)

- `/` — brand landing, live XAUUSD desk, scalp panel, Telegram QR
- `/watch/xauusd` — full gold & forex desk with TradingView
- `/#join` — scan QR → Telegram channel [@LJwealthLab](https://t.me/LJwealthLab)

Telegram channel URL is set in `web/src/lib/site.ts` (or `NEXT_PUBLIC_TELEGRAM_GROUP_URL`).

## MetaTrader 5

See [`mt5/README.md`](mt5/README.md) for the steady-passive EA and XAUUSD scalp indicator.

## Telegram ↔ Cursor bridge

```bash
npm install
cp .env.example .env
npm run dev
```

Dashboard: [http://127.0.0.1:43127](http://127.0.0.1:43127)

Not financial advice. Markets involve risk.
