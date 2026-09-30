export type MarketId =
  | "XAUUSD"
  | "EURUSD"
  | "GBPUSD"
  | "USDJPY"
  | "AUDUSD"
  | "USDCAD"
  | "USDCHF"
  | "NZDUSD";

export type Market = {
  id: MarketId;
  label: string;
  name: string;
  tvSymbol: string;
  kind: "metal" | "forex";
  decimals: number;
  blurb: string;
};

export const MARKETS: Market[] = [
  {
    id: "XAUUSD",
    label: "XAUUSD",
    name: "Gold",
    tvSymbol: "OANDA:XAUUSD",
    kind: "metal",
    decimals: 2,
    blurb: "Gold under DreamTrades attention — levels first, noise last.",
  },
  {
    id: "EURUSD",
    label: "EURUSD",
    name: "Euro / Dollar",
    tvSymbol: "OANDA:EURUSD",
    kind: "forex",
    decimals: 5,
    blurb: "Watch London open structure and the daily mid.",
  },
  {
    id: "GBPUSD",
    label: "GBPUSD",
    name: "Cable",
    tvSymbol: "OANDA:GBPUSD",
    kind: "forex",
    decimals: 5,
    blurb: "Cable respects session extremes — wait for clean acceptance.",
  },
  {
    id: "USDJPY",
    label: "USDJPY",
    name: "Dollar / Yen",
    tvSymbol: "OANDA:USDJPY",
    kind: "forex",
    decimals: 3,
    blurb: "Yields and risk tone still steer the yen cross.",
  },
  {
    id: "AUDUSD",
    label: "AUDUSD",
    name: "Aussie",
    tvSymbol: "OANDA:AUDUSD",
    kind: "forex",
    decimals: 5,
    blurb: "Risk-sensitive — keep an eye on Asia liquidity and China tape.",
  },
  {
    id: "USDCAD",
    label: "USDCAD",
    name: "Loonie",
    tvSymbol: "OANDA:USDCAD",
    kind: "forex",
    decimals: 5,
    blurb: "Oil correlation matters; don’t chase thin NY spikes.",
  },
  {
    id: "USDCHF",
    label: "USDCHF",
    name: "Swissy",
    tvSymbol: "OANDA:USDCHF",
    kind: "forex",
    decimals: 5,
    blurb: "Safe-haven flow pair — fade extremes only with structure.",
  },
  {
    id: "NZDUSD",
    label: "NZDUSD",
    name: "Kiwi",
    tvSymbol: "OANDA:NZDUSD",
    kind: "forex",
    decimals: 5,
    blurb: "Thinner book — smaller size, clearer levels.",
  },
];

export function getMarket(id: string | null | undefined): Market {
  return MARKETS.find((m) => m.id === id) ?? MARKETS[0];
}
