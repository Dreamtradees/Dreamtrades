const beats = [
  {
    title: "Catch the move",
    body: "Hero price. Clean chart. One thesis. LJ CIRCLE is built so the important level hits your eye before the noise does.",
  },
  {
    title: "Stay in circle",
    body: "Telegram keeps the desk tight — gold focus, session notes, and calls that respect structure over hype.",
  },
  {
    title: "Trade with presence",
    body: "Live quotes and TradingView on the site. Your entries stay yours — we sharpen attention, not chase every tick.",
  },
];

export function Practice() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
          Why LJ CIRCLE
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Professional. Fast. Impossible to ignore.
        </h2>
        <p className="mt-3 text-ink/65">
          Designed for traders who want a sharp gold desk — not another cluttered
          feed fighting for scraps of attention.
        </p>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {beats.map((beat, index) => (
          <div key={beat.title} className="border-t border-ink/15 pt-5">
            <p className="font-mono text-xs text-gold">0{index + 1}</p>
            <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-ink">
              {beat.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/65 md:text-base">
              {beat.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
