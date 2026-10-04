"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const items = [
  "I know the market and session I am trading",
  "I have a clear long or short thesis (not a tip)",
  "I can explain the candle / structure that supports that thesis",
  "My stop is defined before entry",
  "Position size matches my risk %",
  "I know where I will take profit or reassess",
  "I am calm enough to follow the plan if price moves against me",
];

export function ChecklistLesson() {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const done = useMemo(() => checked.filter(Boolean).length, [checked]);
  const ready = done === items.length;

  function toggle(index: number) {
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));
  }

  return (
    <section id="checklist" className="scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.22em] text-tide uppercase">05 · Checklist</p>
        <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">Before you click buy or sell.</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Use this every time. If you cannot check every box, you are not ready — sit out. That is how traders last.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <ul className="space-y-3">
            {items.map((item, index) => {
              const on = checked[index];
              return (
                <li key={item}>
                  <button type="button" onClick={() => toggle(index)} className={cn("flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-300", on ? "border-tide/40 bg-tide/10" : "border-ink/10 bg-white/40 hover:border-ink/20")}>
                    <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border text-xs font-bold transition-colors", on ? "border-tide bg-tide text-white" : "border-ink/25 bg-white text-transparent")} aria-hidden>✓</span>
                    <span className="text-sm leading-relaxed text-ink md:text-base">{item}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <aside className="rounded-xl border border-ink/10 bg-[#101820] p-6 text-[#f2f7f8] lg:self-start">
            <p className="font-mono text-xs tracking-[0.22em] text-white/55 uppercase">Readiness</p>
            <p className="mt-3 font-heading text-5xl font-bold tracking-tight">{done}/{items.length}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{ready ? "Checklist complete. Trade your plan — still no guarantees. Review afterward." : "Keep going. Skipping steps is how signal-followers get hurt."}</p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-tide transition-all duration-500" style={{ width: `${(done / items.length) * 100}%` }} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
