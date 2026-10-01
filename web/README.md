# LJ CIRCLE — web

Professional trading site: live XAUUSD quotes, TradingView charts, forex desk, and a Telegram join QR.

## Run locally

```bash
npm install
npm run build
npm run start -- -p 43128 -H 0.0.0.0
```

Dev mode:

```bash
npm run dev -- --port 43128
```

Open [http://127.0.0.1:43128](http://127.0.0.1:43128)

## Highlights

- **LJ CIRCLE** brand hero built to catch attention
- **XAUUSD live price** (refreshes ~5s) + TradingView advanced chart
- Majors switcher on the same desk
- **QR code** → Telegram group (`NEXT_PUBLIC_TELEGRAM_GROUP_URL` or default in `src/lib/site.ts`)
