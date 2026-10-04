"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CHECKLIST, LESSONS, type LessonId } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

export function LearnPath() {
  const [active, setActive] = useState<LessonId>("trade");
  const [side, setSide] = useState<"long" | "short">("long");
  const [checked, setChecked] = useState<boolean[]>(() => CHECKLIST.map(() => false));
  const activeIndex = LESSONS.findIndex((s) => s.id === active);
  const readyCount = checked.filter(Boolean).length;
  const lesson = LESSONS[activeIndex];

  function go(delta: number) {
    const next = Math.min(LESSONS.length - 1, Math.max(0, activeIndex + delta));
    setActive(LESSONS[next].id);
  }

  return (
    <div className="pb-8">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-mark">Curriculum · fundamentals</p>
          <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-ink md:text-5xl">Trading, in plain English</h2>
          <p className="mt-4 text-ink/65 md:text-lg">Six ideas. No unexplained jargon. Built so you can trade with a plan — not copy someone else&apos;s call.</p>
        </div>
        <nav aria-label="Lesson steps" className="mt-10 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LESSONS.map((step, index) => {
            const isActive = step.id === active;
            const isPast = index < activeIndex;
            return (
              <button key={step.id} type="button" onClick={() => setActive(step.id)} className={cn("shrink-0 border-b-2 px-3 py-2 text-left transition-colors", isActive ? "border-mark text-ink" : isPast ? "border-ink/25 text-ink/70 hover:text-ink" : "border-transparent text-ink/45 hover:text-ink/70")}>
                <span className="font-mono text-[11px] tracking-wider text-mark">{step.short}</span>
                <span className="mt-0.5 block text-sm font-medium">{step.label}</span>
              </button>
            );
          })}
        </nav>
        <div key={active} className="animate-rise mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            {active === "trade" && <TradeStep />}
            {active === "direction" && <DirectionStep side={side} onSideChange={setSide} />}
            {active === "pairs" && <PairsStep />}
            {active === "candles" && <CandlesStep />}
            {active === "risk" && <RiskStep />}
            {active === "checklist" && (
              <ChecklistStep checked={checked} onToggle={(i) => setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))} readyCount={readyCount} />
            )}
          </div>
          <aside className="border-t border-ink/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-mark">Remember</p>
            <p className="mt-3 font-heading text-xl font-semibold tracking-tight text-ink">{lesson.rememberTitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{lesson.rememberBody}</p>
            {active === "direction" && <LongShortDemo side={side} />}
            {active === "candles" && <CandleDiagram />}
            {active === "checklist" && <p className="mt-6 font-mono text-xs text-ink/50">{readyCount}/{CHECKLIST.length} checked</p>}
          </aside>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-8">
          <button type="button" onClick={() => go(-1)} disabled={activeIndex === 0} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-md border-ink/20 bg-transparent px-5 text-ink disabled:opacity-40")}>Previous</button>
          <p className="font-mono text-xs text-ink/45">Step {activeIndex + 1} of {LESSONS.length}</p>
          {activeIndex < LESSONS.length - 1 ? (
            <button type="button" onClick={() => go(1)} className={cn(buttonVariants({ size: "lg" }), "rounded-md bg-mark px-5 text-[#041512] hover:bg-[#14b8a0]")}>Next idea</button>
          ) : (
            <Link href="/" className={cn(buttonVariants({ size: "lg" }), "rounded-md bg-ink px-5 text-[#f4f7f8] hover:bg-[#1c2530]")}>Back to DreamTrades</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function TradeStep() {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">What is a trade?</h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">A trade is a bet that a price will move — you <span className="font-semibold text-ink">buy</span> if you think it goes up, or <span className="font-semibold text-ink">sell</span> if you think it goes down.</p>
      <ul className="mt-8 space-y-4 border-l border-ink/15 pl-5">
        <li><p className="font-heading text-base font-semibold text-ink">Market</p><p className="mt-1 text-sm leading-relaxed text-ink/65">The place prices are agreed — gold, currencies, stocks. DreamTrades starts with gold and major forex pairs as the teaching examples.</p></li>
        <li><p className="font-heading text-base font-semibold text-ink">Entry & exit</p><p className="mt-1 text-sm leading-relaxed text-ink/65">You open a position at one price and close it later at another. The difference (minus costs) is your profit or loss.</p></li>
        <li><p className="font-heading text-base font-semibold text-ink">Not a tip feed</p><p className="mt-1 text-sm leading-relaxed text-ink/65">Signals can grab attention. They do not remove risk. Your job is to decide with a plan — not chase every call.</p></li>
      </ul>
    </div>
  );
}

function DirectionStep({ side, onSideChange }: { side: "long" | "short"; onSideChange: (side: "long" | "short") => void }) {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">Price goes up or down</h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75"><span className="font-semibold text-ink">Long</span> means you buy — you want price higher. <span className="font-semibold text-ink">Short</span> means you sell first — you want price lower.</p>
      <div className="mt-8 inline-flex rounded-md border border-ink/15 p-1">
        <button type="button" onClick={() => onSideChange("long")} className={cn("px-5 py-2.5 text-sm font-semibold transition-colors", side === "long" ? "bg-mark text-[#041512]" : "text-ink/55 hover:text-ink")}>Long (buy)</button>
        <button type="button" onClick={() => onSideChange("short")} className={cn("px-5 py-2.5 text-sm font-semibold transition-colors", side === "short" ? "bg-ink text-[#f4f7f8]" : "text-ink/55 hover:text-ink")}>Short (sell)</button>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-ink/65">{side === "long" ? "You are long: if gold rises from your entry, you gain. If it falls, you lose until you exit." : "You are short: if gold falls from your entry, you gain. If it rises, you lose until you exit."}</p>
    </div>
  );
}

function LongShortDemo({ side }: { side: "long" | "short" }) {
  const upHelps = side === "long";
  return (
    <div className="mt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">Demo · same price rise</p>
      <svg viewBox="0 0 280 120" className="mt-3 w-full max-w-sm" role="img" aria-label={upHelps ? "Rising price line helps a long trade" : "Rising price line hurts a short trade"}>
        <rect width="280" height="120" fill="#f4f7f8" />
        <line x1="24" y1="96" x2="256" y2="96" stroke="#11161d22" strokeWidth="1" />
        <path d="M28 88 C 70 86, 90 70, 120 58 C 150 46, 170 40, 210 28 L 248 18" fill="none" stroke="#0f9f8a" strokeWidth="2.5" className="chart-line" />
        <circle cx="70" cy="78" r="4" fill="#e85d4c" />
        <text x="78" y="72" fontSize="10" fill="#11161d" fontFamily="monospace">entry</text>
        <text x="24" y="16" fontSize="11" fill={upHelps ? "#0f9f8a" : "#b42318"} fontFamily="monospace">{upHelps ? "Price up → long profits" : "Price up → short loses"}</text>
      </svg>
    </div>
  );
}

function PairsStep() {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">Pairs — and why XAUUSD is a good teacher</h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">Forex and gold are quoted as <span className="font-semibold text-ink">pairs</span>: how much of one thing buys one of another.</p>
      <div className="mt-8 space-y-5">
        <div className="border-t border-ink/15 pt-5"><p className="font-mono text-xs text-mark">XAUUSD</p><p className="mt-2 text-sm leading-relaxed text-ink/65"><span className="font-semibold text-ink">XAU</span> = gold. <span className="font-semibold text-ink">USD</span> = US dollar. The number is dollars per ounce of gold — a clear example for learning direction and risk.</p></div>
        <div className="border-t border-ink/15 pt-5"><p className="font-mono text-xs text-mark">EURUSD</p><p className="mt-2 text-sm leading-relaxed text-ink/65">How many dollars one euro buys. Majors like this sit beside gold so you can see the wider forex picture while you practice.</p></div>
        <div className="border-t border-ink/15 pt-5"><p className="font-mono text-xs text-mark">Why focus?</p><p className="mt-2 text-sm leading-relaxed text-ink/65">Attention beats watching everything. Learn one market deeply, then expand — instead of drowning in every signal that scrolls past.</p></div>
      </div>
    </div>
  );
}

function CandlesStep() {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">Charts in 60 seconds</h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">A <span className="font-semibold text-ink">candlestick</span> shows what price did in one time slice — open, high, low, and close.</p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {[["Open", "Price when the period started."], ["High", "Highest price during the period."], ["Low", "Lowest price during the period."], ["Close", "Price when the period ended."]].map(([term, def]) => (
          <div key={term} className="border-t border-ink/15 pt-4"><dt className="font-heading text-base font-semibold text-ink">{term}</dt><dd className="mt-1 text-sm text-ink/65">{def}</dd></div>
        ))}
      </dl>
      <p className="mt-6 text-sm leading-relaxed text-ink/65">Timeframes matter. A one-minute candle is noise-heavy. A daily candle shows a bigger story. Pick one timeframe for practice and stick with it while you learn.</p>
    </div>
  );
}

function CandleDiagram() {
  return (
    <div className="mt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">Anatomy</p>
      <svg viewBox="0 0 200 160" className="mt-3 w-full max-w-[200px]" role="img" aria-label="Candlestick with wick and body labeled">
        <line x1="90" y1="16" x2="90" y2="144" stroke="#11161d55" strokeWidth="2" />
        <rect x="70" y="48" width="40" height="64" fill="#0f9f8a" />
        <text x="120" y="28" fontSize="11" fill="#516070" fontFamily="monospace">high</text>
        <text x="120" y="70" fontSize="11" fill="#516070" fontFamily="monospace">close</text>
        <text x="120" y="100" fontSize="11" fill="#516070" fontFamily="monospace">open</text>
        <text x="120" y="148" fontSize="11" fill="#516070" fontFamily="monospace">low</text>
      </svg>
    </div>
  );
}

function RiskStep() {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">Risk is the real skill</h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">New traders ask &ldquo;where will it go?&rdquo; DreamTrades starts with &ldquo;how much can I lose if I am wrong?&rdquo;</p>
      <ul className="mt-8 space-y-4 border-l border-ink/15 pl-5">
        <li><p className="font-heading text-base font-semibold text-ink">Stop loss</p><p className="mt-1 text-sm leading-relaxed text-ink/65">The price where you exit if the trade fails. Set it before you enter — not after you panic.</p></li>
        <li><p className="font-heading text-base font-semibold text-ink">Position size</p><p className="mt-1 text-sm leading-relaxed text-ink/65">How big the trade is. Bigger size means bigger gain — and bigger damage. Size to the stop, not to the hope.</p></li>
        <li><p className="font-heading text-base font-semibold text-ink">Survivable money</p><p className="mt-1 text-sm leading-relaxed text-ink/65">Never risk rent, bills, or money that changes your life if it is gone. Practice on small size until the process is calm.</p></li>
      </ul>
    </div>
  );
}

function ChecklistStep({ checked, onToggle, readyCount }: { checked: boolean[]; onToggle: (index: number) => void; readyCount: number }) {
  const ready = readyCount === CHECKLIST.length;
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">Before you click buy or sell</h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">Tick every box. If you cannot — sit out. Sitting out is a trading skill.</p>
      <ul className="mt-8 space-y-3">
        {CHECKLIST.map((item, index) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-ink/10 bg-white/50 px-4 py-3 transition-colors hover:border-mark/40">
              <input type="checkbox" checked={checked[index]} onChange={() => onToggle(index)} className="mt-1 size-4 accent-[var(--mark)]" />
              <span className="text-sm leading-relaxed text-ink/80">{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className={cn("mt-6 font-mono text-sm", ready ? "text-mark" : "text-ink/50")}>{ready ? "Ready — you have a plan. Now execute calmly." : "Not ready yet — finish the list or skip the trade."}</p>
    </div>
  );
}
