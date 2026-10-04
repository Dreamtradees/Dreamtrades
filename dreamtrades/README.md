# DreamTrades

Standalone teaching site for the **DreamTrades** trading group.

**Positioning:** teach how to actually trade — not how to take signals. Plain-English fundamentals for newbies.

This app is separate from **LJ CIRCLE** (`web/`), which remains the attentive XAUUSD desk + Telegram join experience.

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

- `/` — DreamTrades brand landing + why this path exists
- `/learn` — six-step interactive curriculum (trade, long/short, pairs, candles, risk, checklist)

## What it teaches

1. What a trade is (entry, exit, risk — not a tip feed)
2. Long vs short with an interactive demo
3. How pairs like XAUUSD and EURUSD are quoted
4. Candlestick basics (OHLC)
5. Risk: stop loss, position size, survivable money
6. A before-you-click checklist

Not financial advice. Markets involve risk.
