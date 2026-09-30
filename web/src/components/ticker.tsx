const items = [
  "EURUSD · patient bid",
  "XAUUSD · mid-range watch",
  "NAS100 · trend respect",
  "BTCUSD · higher-low hold",
  "US10Y · yield drift",
  "DXY · soft pressure",
];

export function Ticker() {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-[color-mix(in_srgb,white_40%,transparent)]">
      <div className="ticker-track flex w-max gap-10 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ink/55">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
