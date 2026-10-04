"use client";

import { useMemo, useState } from "react";

export function RiskLesson() {
  const [account, setAccount] = useState(1000);
  const [riskPct, setRiskPct] = useState(1);
  const [stopPoints, setStopPoints] = useState(20);
  const riskAmount = useMemo(() => (account * riskPct) / 100, [account, riskPct]);
  const unitsPerPoint = useMemo(() => (stopPoints > 0 ? riskAmount / stopPoints : 0), [riskAmount, stopPoints]);

  return (
    <section id="risk" className="scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.22em] text-tide uppercase">04 · Risk</p>
        <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">Risk first. Size second. Entry last.</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Professionals decide how much they can lose before they care about how much they might make. Keep risk small and consistent — many beginners blow up by sizing from hope, not math.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-5 rounded-xl border border-ink/10 bg-white/45 p-6 backdrop-blur-sm">
            <Field label="Account balance" value={account} min={100} max={50000} step={100} suffix="USD" onChange={setAccount} />
            <Field label="Risk per trade" value={riskPct} min={0.25} max={5} step={0.25} suffix="%" onChange={setRiskPct} />
            <Field label="Stop distance" value={stopPoints} min={5} max={100} step={1} suffix="points" onChange={setStopPoints} />
          </div>
          <div className="rounded-xl bg-[#101820] p-6 text-[#f2f7f8]">
            <p className="font-mono text-xs tracking-[0.22em] text-white/55 uppercase">Simple risk math</p>
            <p className="mt-4 font-heading text-4xl font-bold tracking-tight">${riskAmount.toFixed(2)}</p>
            <p className="mt-2 text-sm text-white/70">Maximum planned loss at your stop ({riskPct}% of account).</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white/5 px-4 py-3"><p className="text-xs text-white/55">Risk dollars</p><p className="mt-1 font-heading text-xl font-bold">${riskAmount.toFixed(2)}</p></div>
              <div className="rounded-lg bg-white/5 px-4 py-3"><p className="text-xs text-white/55">Value per point (approx)</p><p className="mt-1 font-heading text-xl font-bold">${unitsPerPoint.toFixed(2)}</p></div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-white/65">If the stop is farther, size smaller so the same dollar risk still holds. That is trading skill — not a VIP signal.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, min, max, step, suffix, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="font-mono text-sm text-tide">{value}{suffix === "%" ? "%" : ` ${suffix}`}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ink/10 accent-tide" />
    </label>
  );
}
