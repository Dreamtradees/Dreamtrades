const pairs = [
  { symbol: "XAUUSD", name: "Gold vs US dollar", note: "A commodity priced in dollars — popular for clear trends and volatility." },
  { symbol: "EURUSD", name: "Euro vs US dollar", note: "A major forex pair. You’re trading relative strength between two currencies." },
  { symbol: "GBPUSD", name: "Pound vs US dollar", note: "Another major. Same idea: one side rises when the other weakens." },
];

export function MarketsLesson() {
  return (
    <section id="markets" className="scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="font-mono text-xs tracking-[0.22em] text-tide uppercase">01 · Markets</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">A market is a place prices meet.</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            When you trade, you take a position on whether a price will rise or fall. Forex and gold are quoted as pairs: the first asset versus the second. Your job is not to guess randomly — it is to understand what the chart is showing and manage risk around that view.
          </p>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-ink/85 md:text-base">
            <li><span className="font-semibold text-ink">Price</span> — where buyers and sellers last agreed.</li>
            <li><span className="font-semibold text-ink">Volatility</span> — how far and how fast price can move.</li>
            <li><span className="font-semibold text-ink">Session</span> — when liquidity is active (London, New York, Asia).</li>
          </ul>
        </div>
        <div className="space-y-4">
          {pairs.map((pair) => (
            <article key={pair.symbol} className="border-l-2 border-tide/70 bg-white/40 py-4 pl-4 pr-3 backdrop-blur-sm">
              <p className="font-mono text-sm font-medium tracking-wide text-tide">{pair.symbol}</p>
              <h3 className="mt-1 font-heading text-lg font-bold text-ink">{pair.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{pair.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
