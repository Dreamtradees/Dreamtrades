"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function LongShortLesson() {
  const [side, setSide] = useState<"long" | "short">("long");
  const isLong = side === "long";

  return (
    <section id="long-short" className="scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.22em] text-tide uppercase">02 · Long / Short</p>
        <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">Long bets on rise. Short bets on fall.</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Toggle the demo. Notice how profit and loss reverse when direction changes — same market, opposite thesis.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setSide("long")} className={cn("rounded-md px-5 py-3 text-sm font-semibold transition-all duration-300", isLong ? "bg-up text-white shadow-sm" : "bg-white/50 text-ink/70 hover:bg-white/80")}>Long (buy)</button>
            <button type="button" onClick={() => setSide("short")} className={cn("rounded-md px-5 py-3 text-sm font-semibold transition-all duration-300", !isLong ? "bg-down text-white shadow-sm" : "bg-white/50 text-ink/70 hover:bg-white/80")}>Short (sell)</button>
            <p className="w-full text-sm leading-relaxed text-muted-foreground">
              {isLong ? "You profit if price goes up from your entry. You lose if it goes down." : "You profit if price goes down from your entry. You lose if it goes up."}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-[#101820] p-6 text-[#f2f7f8]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-widest text-white/55 uppercase">Demo · XAUUSD</p>
                <p className="mt-1 font-heading text-2xl font-bold">Entry 2,450.00</p>
              </div>
              <p className={cn("rounded-md px-3 py-1 font-mono text-xs font-medium uppercase tracking-wide transition-colors duration-300", isLong ? "bg-up/20 text-[#9be7c4]" : "bg-down/20 text-[#f0a39c]")}>{isLong ? "Long" : "Short"}</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white/5 px-4 py-3">
                <p className="text-xs text-white/55">If price → 2,470</p>
                <p className={cn("mt-1 font-heading text-xl font-bold transition-colors duration-300", isLong ? "text-[#9be7c4]" : "text-[#f0a39c]")}>{isLong ? "+$200" : "−$200"}</p>
              </div>
              <div className="rounded-lg bg-white/5 px-4 py-3">
                <p className="text-xs text-white/55">If price → 2,430</p>
                <p className={cn("mt-1 font-heading text-xl font-bold transition-colors duration-300", !isLong ? "text-[#9be7c4]" : "text-[#f0a39c]")}>{isLong ? "−$200" : "+$200"}</p>
              </div>
            </div>
            <svg viewBox="0 0 320 90" className="mt-8 h-24 w-full" aria-hidden>
              <path d="M8 70 C 60 68, 90 40, 140 45 S 220 20, 312 28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <path d={isLong ? "M8 70 C 60 68, 90 40, 140 45 S 220 20, 312 28" : "M8 28 C 60 30, 90 58, 140 52 S 220 72, 312 64"} fill="none" stroke={isLong ? "#0b8a5c" : "#b83a2e"} strokeWidth="3" className="transition-all duration-500" />
              <circle cx="140" cy={isLong ? 45 : 52} r="5" fill="#c9953a" className="transition-all duration-500" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
