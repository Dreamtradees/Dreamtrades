const beats = [
  {
    title: "Quiet open",
    body: "We mark the levels before the crowd wakes up — prior day, session extremes, and the one invalidation that matters.",
  },
  {
    title: "One thesis",
    body: "No fifteen conflicting ideas. DreamTrades holds a single attentive read and updates it only when the tape forces the issue.",
  },
  {
    title: "Clean exits",
    body: "Attention includes knowing when to stop watching. Targets and fails are written before emotion arrives.",
  },
];

export function Practice() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-tide">
          The practice
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Attentive by design, not by accident.
        </h2>
        <p className="mt-3 text-ink/65">
          Most trading rooms amplify urgency. We train presence — so you see the
          move that matters and skip the rest.
        </p>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {beats.map((beat, index) => (
          <div key={beat.title} className="border-t border-ink/15 pt-5">
            <p className="font-mono text-xs text-signal">0{index + 1}</p>
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
