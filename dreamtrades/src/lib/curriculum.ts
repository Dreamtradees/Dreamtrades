export const LESSONS = [
  {
    id: "trade",
    short: "01",
    label: "A trade",
    title: "What a trade actually is",
    rememberTitle: "You exchange risk for a chance at profit.",
    rememberBody:
      "Every trade has a buyer and a seller. One side is wrong about the next move — your job is to survive being wrong.",
  },
  {
    id: "direction",
    short: "02",
    label: "Long & short",
    title: "Buy up. Sell down.",
    rememberTitle: "Profit comes from being right about direction.",
    rememberBody:
      "Long wins if price rises. Short wins if price falls. Same chart — opposite bets.",
  },
  {
    id: "pairs",
    short: "03",
    label: "Pairs",
    title: "Prices come in pairs",
    rememberTitle: "XAUUSD is gold priced in US dollars.",
    rememberBody:
      "When you read XAUUSD, you are watching how many dollars one ounce of gold costs.",
  },
  {
    id: "candles",
    short: "04",
    label: "Candles",
    title: "Charts in plain English",
    rememberTitle: "One candle = one period of price action.",
    rememberBody:
      "Open, high, low, close. Green usually closed higher. Red usually closed lower.",
  },
  {
    id: "risk",
    short: "05",
    label: "Risk",
    title: "Survive before you profit",
    rememberTitle: "Protect the account first.",
    rememberBody:
      "A stop is your exit if you are wrong. Size the trade so a loss is survivable — never rent money.",
  },
  {
    id: "checklist",
    short: "06",
    label: "Checklist",
    title: "Before you click",
    rememberTitle: "If you skip the checklist, skip the trade.",
    rememberBody:
      "Discipline beats excitement. Tick every box — then act with a clear head.",
  },
] as const;

export type LessonId = (typeof LESSONS)[number]["id"];

export const CHECKLIST = [
  "I know if I am buying (long) or selling (short).",
  "I know why this idea matters — not just a tip or a signal.",
  "I set a stop loss before I enter.",
  "The money I risk is money I can lose without stress.",
  "Position size fits my stop — not hope.",
  "I have a plan to exit if I am wrong.",
] as const;

export const PATH_PREVIEW = [
  {
    n: "01",
    title: "Think in trades",
    body: "A trade is a clear bet on direction — with an entry, an exit, and a plan.",
  },
  {
    n: "02",
    title: "Own the direction",
    body: "Long vs short is not jargon. It is which way you need price to move.",
  },
  {
    n: "03",
    title: "Risk before reward",
    body: "Stops, size, and survivable losses come before chasing a tip.",
  },
] as const;
