const items = [
  "LJ CIRCLE · attentive desk",
  "XAUUSD · live gold price",
  "XAUUSD · TradingView charts",
  "EURUSD · session structure",
  "GBPUSD · clean levels only",
  "Join Telegram · scan the circle",
];

export function Ticker() {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-[color-mix(in_srgb,white_45%,transparent)]">
      <div className="ticker-track flex w-max gap-10 py-3.5 font-mono text-[13px] uppercase tracking-[0.16em] text-ink/75">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
