# First Tape

Standalone teaching website for new traders. **We teach you to trade — not to copy signals.**

This is **not** LJ CIRCLE. LJ CIRCLE remains the trading desk at `../web` (port **43128**). First Tape is education-only on port **43129**.

## What you learn

1. **Markets** — pairs, price, volatility, sessions
2. **Long / Short** — interactive direction demo
3. **Candles** — OHLC reading
4. **Risk** — size from account risk %, not hope
5. **Checklist** — before-you-trade readiness gate

## Run locally

```bash
cd first-tape
npm install
npm run build
npm run start -- -p 43129 -H 0.0.0.0
```

Open [http://127.0.0.1:43129](http://127.0.0.1:43129)

From repo root: `npm run start:first-tape`

## Stack

Next.js · TypeScript · Tailwind CSS · shadcn/ui

Education only — not financial advice. Markets involve risk of loss.
