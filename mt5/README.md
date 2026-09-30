# DreamTrades Steady Passive — MetaTrader 5 bot

Conservative, low-frequency **Expert Advisor (EA)** for MetaTrader 5.

It waits for a slow EMA trend, then enters on a pullback — with fixed risk %, ATR stops, max one trade, and a daily loss pause.

> Not financial advice. **Test on a demo account first.** Markets can lose money even with “steady” settings.

## What I cannot do from here

I **cannot log into your broker / MT5 account** for you.  
You connect the bot locally in MetaTrader 5 (or on a VPS) with your own login.

## Install & connect to your account

### 1. Log into MT5 with your broker

1. Install [MetaTrader 5](https://www.metatrader5.com/).
2. File → Login to Trade Account.
3. Enter your **broker server**, **login**, and **password**.
4. Confirm the bottom-right account number is yours (demo recommended first).

### 2. Install the EA

1. In MT5: **File → Open Data Folder**.
2. Go to `MQL5/Experts/`.
3. Copy `Experts/DreamTrades_SteadyPassive.mq5` from this repo into that folder.
4. In MT5 Navigator, right-click **Expert Advisors → Refresh**.
5. Open MetaEditor (F4), open the file, press **Compile** (F7).  
   You should get `0 errors`.

### 3. Attach it to a chart

1. Open a chart (XAUUSD, EURUSD, etc. — same symbol you want traded).
2. Set timeframe to **H1** (matches default trend TF) or change the input.
3. Drag **DreamTrades_SteadyPassive** onto the chart.
4. In the Common tab:
   - ✅ Allow Algo Trading
   - ✅ Allow live trading (only when you’re ready)
5. Check inputs (risk defaults are conservative: **0.5%** per trade).
6. Click OK.
7. Top toolbar: enable **Algo Trading** (button should be green/highlighted).
8. On the chart, the EA smiley/icon should be active (not sad face).

### 4. Confirm it’s connected

- Toolbox → **Experts** tab shows: `DreamTrades SteadyPassive ready on ...`
- Toolbox → **Trade** shows positions with comment `DT-SteadyPassive` when it trades.
- If nothing trades for a while, that’s normal — this bot is **deliberately passive**.

## Default behaviour

| Setting | Default | Meaning |
| --- | --- | --- |
| Trend TF | H1 | Slow decisions |
| EMAs | 34 / 89 / 21 | Trend + pullback |
| Risk | 0.5% | Per new trade |
| Max trades | 1 | No stacking |
| Daily loss pause | 2% | Stops for the day if breached |
| SL / TP | 2× / 3× ATR | Structure-based exits |

## Suggested first run

1. **Demo account only** for at least 1–2 weeks.
2. Start with **XAUUSD H1** or **EURUSD H1**.
3. Keep `InpRiskPercent` at **0.25–0.5**.
4. Only switch to live when you understand the fills and drawdowns.

## XAUUSD scalping signals (indicator)

Chart arrows for **M1 gold scalps** using EMA 9/21 + RSI 7 on your broker’s XAUUSD ticks.

This is an **indicator** (signals only) — it does **not** open trades.

### Install

1. File → Open Data Folder → `MQL5/Indicators/`
2. Copy `Indicators/DreamTrades_XAU_ScalpSignals.mq5` into that folder
3. MetaEditor → Compile (F7) → `0 errors`
4. Open **XAUUSD M1** chart
5. Drag **DreamTrades_XAU_ScalpSignals** onto the chart
6. Green arrow = BUY scalp · Red arrow = SELL scalp · On-chart label = live bias

Site mirror (futures proxy, refreshes ~15s): `/#scalp` and `/watch/xauusd#scalp`

> Broker XAUUSD can differ from the website GC=F proxy. Prefer the MT5 arrows for your own feed.

## Files

```
mt5/
  Experts/DreamTrades_SteadyPassive.mq5
  Indicators/DreamTrades_XAU_ScalpSignals.mq5
  README.md
```

## Need help connecting?

Send:

1. Your broker name (e.g. IC Markets, Exness, …)
2. Demo or live
3. Symbol you want (XAUUSD / EURUSD / …)
4. Any compile error text from MetaEditor

I still can’t enter your password, but I can tune inputs or fix compile issues.
