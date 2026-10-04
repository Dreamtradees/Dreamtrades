# LJ CIRCLE + First Tape

| App | Folder | Port | Role |
| --- | --- | --- | --- |
| **LJ CIRCLE** | `web/` | 43128 | XAUUSD desk + Telegram QR (`@LJwealthLab`) |
| **First Tape** | `first-tape/` | 43129 | Teach how to trade — not copy signals |

## First Tape
```bash
cd first-tape && npm install && npm run build && npm run start -- -p 43129 -H 0.0.0.0
```
http://127.0.0.1:43129

## LJ CIRCLE
```bash
cd web && npm install && npm run build && npm run start -- -p 43128 -H 0.0.0.0
```
http://127.0.0.1:43128

Not financial advice.
