const steps = [
  { id: "markets", title: "Markets", text: "What you are trading and how prices move." },
  { id: "long-short", title: "Long / Short", text: "Two directions. One decision: where value goes next." },
  { id: "candles", title: "Candles", text: "Read open, high, low, close — the language of charts." },
  { id: "risk", title: "Risk", text: "Protect capital before you chase a win." },
  { id: "checklist", title: "Checklist", text: "A repeatable pre-trade routine for beginners." },
];

export function PathOverview() {
  return (
    <section id="path" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.22em] text-tide uppercase">The path</p>
        <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold tracking-tight text-ink md:text-5xl">
          Five fundamentals. No signal copying.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          First Tape is a teaching product. You build judgment — entries, exits,
          and risk — instead of waiting for someone else to tell you what to click.
        </p>
        <ol className="mt-12 grid gap-8 md:grid-cols-5 md:gap-5">
          {steps.map((step, index) => (
            <li key={step.id}>
              <a href={`#${step.id}`} className="group block transition-transform duration-300 hover:-translate-y-0.5">
                <span className="font-mono text-sm text-tide">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-heading text-xl font-bold tracking-tight text-ink group-hover:text-tide">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
