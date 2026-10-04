# DreamTrades (priority) + LJ CIRCLE (friend)

## DreamTrades — teaching site

Standalone education product for the **DreamTrades** group. Teaches how to trade (fundamentals), not how to take signals.

```bash
cd dreamtrades
npm install
npm run build
npm run start -- -p 43129 -H 0.0.0.0
```

Open [http://127.0.0.1:43129](http://127.0.0.1:43129)

Details: [`dreamtrades/README.md`](dreamtrades/README.md)

## LJ CIRCLE (friend’s site — leave as-is)

Attentive XAUUSD desk under `web/` with Telegram QR → [@LJwealthLab](https://t.me/LJwealthLab). Left alone for your friend — not grown with DreamTrades curriculum.

```bash
cd web
npm install
npm run build
npm run start -- -p 43128 -H 0.0.0.0
```

Open [http://127.0.0.1:43128](http://127.0.0.1:43128)

## MetaTrader 5 / Telegram bridge

See [`mt5/README.md`](mt5/README.md) and root `npm run dev` (port 43127).

Not financial advice. Markets involve risk.
