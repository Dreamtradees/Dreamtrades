"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { GraduationPanel } from "@/components/graduation-panel";
import { XauusdChart } from "@/components/xauusd-chart";
import {
  CandlesIllustration,
  ChecklistIllustration,
  DirectionIllustration,
  PairsIllustration,
  RiskIllustration,
  TradeIllustration,
  ZoneMarkingSteps,
  ZoneSketchAside,
} from "@/components/lesson-illustrations";
import { CHECKLIST, LESSONS, type LessonId } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

export function LearnPath() {
  const [active, setActive] = useState<LessonId>("trade");
  const [side, setSide] = useState<"long" | "short">("long");
  const [balance, setBalance] = useState(50);
  const [checked, setChecked] = useState<boolean[]>(() => CHECKLIST.map(() => false));
  const activeIndex = LESSONS.findIndex((s) => s.id === active);
  const readyCount = checked.filter(Boolean).length;
  const checklistComplete = readyCount === CHECKLIST.length;
  const lesson = LESSONS[activeIndex];
  const wasComplete = useRef(false);

  useEffect(() => {
    if (checklistComplete && active === "checklist" && !wasComplete.current) {
      wasComplete.current = true;
      requestAnimationFrame(() => {
        document.querySelector("[data-testid='graduation-panel']")?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      });
    }
    if (!checklistComplete) wasComplete.current = false;
  }, [checklistComplete, active]);

  function go(delta: number) {
    const next = Math.min(LESSONS.length - 1, Math.max(0, activeIndex + delta));
    setActive(LESSONS[next].id);
  }

  function toggleCheck(index: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === index ? !v : v)));
  }

  return (
    <div className="pb-8">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-mark">Curriculum · fundamentals</p>
          <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-ink md:text-5xl">Trading, in plain English</h2>
          <p className="mt-4 text-ink/65 md:text-lg">
            Seven ideas with pictures. No unexplained jargon. Built so you can trade with a plan — not copy someone else&apos;s call.
          </p>
        </div>
        <nav aria-label="Lesson steps" className="mt-10 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LESSONS.map((step, index) => {
            const isActive = step.id === active;
            const isPast = index < activeIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActive(step.id)}
                className={cn(
                  "shrink-0 border-b-2 px-3 py-2 text-left transition-colors",
                  isActive ? "border-mark text-ink" : isPast ? "border-ink/25 text-ink/70 hover:text-ink" : "border-transparent text-ink/45 hover:text-ink/70",
                )}
              >
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
            {active === "supply-demand" && <SupplyDemandStep balance={balance} onBalanceChange={setBalance} />}
            {active === "risk" && <RiskStep />}
            {active === "checklist" && (
              <ChecklistStep
                checked={checked}
                onToggle={toggleCheck}
                readyCount={readyCount}
                complete={checklistComplete}
              />
            )}
          </div>
          <aside className="border-t border-ink/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            {!(active === "checklist" && checklistComplete) && (
              <>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-mark">Remember</p>
                <p className="mt-3 font-heading text-xl font-semibold tracking-tight text-ink">{lesson.rememberTitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{lesson.rememberBody}</p>
              </>
            )}
            {active === "direction" && <DirectionIllustration side={side} />}
            {active === "pairs" && (
              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">Live example · XAUUSD</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  Watch the quote move while you learn what the pair means. Full desk below the lessons.
                </p>
                <div className="mt-4">
                  <XauusdChart variant="overview" height={280} />
                </div>
                <Link href="#live-gold" className="mt-3 inline-block text-sm font-medium text-mark hover:text-[#0c8572]">
                  Open the live gold desk ↓
                </Link>
              </div>
            )}
            {active === "candles" && <CandleAside />}
            {active === "supply-demand" && <ZoneSketchAside />}
            {active === "risk" && <RiskAside />}
            {active === "checklist" &&
              (checklistComplete ? (
                <div className="mt-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">Next step</p>
                  <p className="mt-3 font-heading text-xl font-semibold tracking-tight text-ink">
                    You unlocked the VIP rooms
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">
                    Congrats copy, QR codes, and join links are in the lesson column — Telegram VIP and WhatsApp.
                  </p>
                </div>
              ) : (
                <div className="unlock-pulse mt-6 rounded-md border-2 border-mark/50 bg-[color-mix(in_srgb,#0f9f8a_12%,white)] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
                    Unlock reward
                  </p>
                  <p className="mt-2 font-heading text-lg font-bold tracking-tight text-ink">
                    Tick every box → Telegram VIP & WhatsApp
                  </p>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <p className="font-mono text-xs font-semibold text-ink">
                      {readyCount}/{CHECKLIST.length} checked
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mark">
                      Readiness
                    </p>
                  </div>
                  <div
                    className="mt-2 h-2.5 overflow-hidden rounded-full bg-ink/10"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={CHECKLIST.length}
                    aria-valuenow={readyCount}
                    aria-label="Checklist readiness"
                  >
                    <div
                      className="h-full rounded-full bg-mark transition-[width] duration-300 ease-out"
                      style={{ width: `${(readyCount / CHECKLIST.length) * 100}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-ink/70">
                    Finish every box — QR codes and join links unlock instantly.
                  </p>
                </div>
              ))}
          </aside>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-8">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={activeIndex === 0}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-md border-ink/20 bg-transparent px-5 text-ink disabled:opacity-40",
            )}
          >
            Previous
          </button>
          <p className="font-mono text-xs text-ink/45">
            Step {activeIndex + 1} of {LESSONS.length}
          </p>
          {activeIndex < LESSONS.length - 1 ? (
            <button
              type="button"
              onClick={() => go(1)}
              className={cn(buttonVariants({ size: "lg" }), "rounded-md bg-mark px-5 text-[#041512] hover:bg-[#14b8a0]")}
            >
              Next idea
            </button>
          ) : checklistComplete ? (
            <p
              className="max-w-[16rem] text-right font-mono text-xs leading-relaxed text-mark"
              data-testid="graduation-footer"
            >
              You graduated — Telegram VIP & WhatsApp are unlocked above.
            </p>
          ) : (
            <p
              className="unlock-pulse max-w-[18rem] rounded-md border-2 border-mark bg-mark px-3 py-2 text-right font-heading text-sm font-bold leading-snug text-[#041512]"
              data-testid="unlock-footer"
            >
              Tick every box to unlock Telegram VIP & WhatsApp
            </p>
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
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        A trade is a bet that a price will move — you <span className="font-semibold text-ink">buy</span> if you think it
        goes up, or <span className="font-semibold text-ink">sell</span> if you think it goes down.
      </p>
      <TradeIllustration />
      <ul className="mt-8 space-y-4 border-l border-ink/15 pl-5">
        <li>
          <p className="font-heading text-base font-semibold text-ink">Market</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            The place prices are agreed — gold, currencies, stocks. DreamTrades starts with gold and major forex pairs as
            the teaching examples.
          </p>
        </li>
        <li>
          <p className="font-heading text-base font-semibold text-ink">Entry & exit</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            You open a position at one price and close it later at another. The difference (minus costs) is your profit
            or loss.
          </p>
        </li>
        <li>
          <p className="font-heading text-base font-semibold text-ink">Not a tip feed</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            Signals can grab attention. They do not remove risk. Your job is to decide with a plan — not chase every call.
          </p>
        </li>
      </ul>
    </div>
  );
}

function DirectionStep({
  side,
  onSideChange,
}: {
  side: "long" | "short";
  onSideChange: (side: "long" | "short") => void;
}) {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">Price goes up or down</h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        <span className="font-semibold text-ink">Long</span> means you buy — you want price higher.{" "}
        <span className="font-semibold text-ink">Short</span> means you sell first — you want price lower.
      </p>
      <div className="mt-8 inline-flex rounded-md border border-ink/15 p-1">
        <button
          type="button"
          onClick={() => onSideChange("long")}
          className={cn(
            "px-5 py-2.5 text-sm font-semibold transition-colors",
            side === "long" ? "bg-mark text-[#041512]" : "text-ink/55 hover:text-ink",
          )}
        >
          Long (buy)
        </button>
        <button
          type="button"
          onClick={() => onSideChange("short")}
          className={cn(
            "px-5 py-2.5 text-sm font-semibold transition-colors",
            side === "short" ? "bg-ink text-[#f4f7f8]" : "text-ink/55 hover:text-ink",
          )}
        >
          Short (sell)
        </button>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-ink/65">
        {side === "long"
          ? "You are long: if gold rises from your entry, you gain. If it falls, you lose until you exit."
          : "You are short: if gold falls from your entry, you gain. If it rises, you lose until you exit."}
      </p>
      {/* Mobile-first: show the path illustration in the main column too on small screens via aside on lg — duplicate light version for clarity */}
      <div className="lg:hidden">
        <DirectionIllustration side={side} />
      </div>
    </div>
  );
}

function PairsStep() {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Pairs — and why XAUUSD is a good teacher
      </h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        Forex and gold are quoted as <span className="font-semibold text-ink">pairs</span>: how much of one thing buys one
        of another.
      </p>
      <PairsIllustration />
      <div className="mt-8 space-y-5">
        <div className="border-t border-ink/15 pt-5">
          <p className="font-mono text-xs text-mark">XAUUSD</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            <span className="font-semibold text-ink">XAU</span> = gold. <span className="font-semibold text-ink">USD</span>{" "}
            = US dollar. The number is dollars per ounce of gold — a clear example for learning direction and risk.
          </p>
        </div>
        <div className="border-t border-ink/15 pt-5">
          <p className="font-mono text-xs text-mark">EURUSD</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            How many dollars one euro buys. Majors like this sit beside gold so you can see the wider forex picture while
            you practice.
          </p>
        </div>
        <div className="border-t border-ink/15 pt-5">
          <p className="font-mono text-xs text-mark">Why focus?</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            Attention beats watching everything. Learn one market deeply, then expand — instead of drowning in every
            signal that scrolls past.
          </p>
        </div>
      </div>
    </div>
  );
}

function CandlesStep() {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">Charts in 60 seconds</h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        A <span className="font-semibold text-ink">candlestick</span> shows what price did in one time slice — open, high,
        low, and close.
      </p>
      <CandlesIllustration />
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {(
          [
            ["Open", "Price when the period started."],
            ["High", "Highest price during the period."],
            ["Low", "Lowest price during the period."],
            ["Close", "Price when the period ended."],
          ] as const
        ).map(([term, def]) => (
          <div key={term} className="border-t border-ink/15 pt-4">
            <dt className="font-heading text-base font-semibold text-ink">{term}</dt>
            <dd className="mt-1 text-sm text-ink/65">{def}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm leading-relaxed text-ink/65">
        Timeframes matter. A one-minute candle is noise-heavy. A daily candle shows a bigger story. Pick one timeframe
        for practice and stick with it while you learn.
      </p>
    </div>
  );
}

function CandleAside() {
  return (
    <div className="mt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">Quick recall</p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/65">
        <li>Body = open → close</li>
        <li>Wick up = high</li>
        <li>Wick down = low</li>
        <li>Green ≈ closed up · red ≈ closed down</li>
      </ul>
    </div>
  );
}

function SupplyDemandStep({
  balance,
  onBalanceChange,
}: {
  balance: number;
  onBalanceChange: (value: number) => void;
}) {
  const demandHeavy = balance > 55;
  const supplyHeavy = balance < 45;
  const hint = demandHeavy
    ? "Demand is stronger — buyers are lifting price."
    : supplyHeavy
      ? "Supply is stronger — sellers are pushing price down."
      : "Roughly balanced — price drifts until one side takes control.";
  const badge = demandHeavy ? "Price tends to rise" : supplyHeavy ? "Price tends to fall" : "Price can stall";

  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Buyers vs sellers — that is the whole engine
      </h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        <span className="font-semibold text-ink">Demand</span> is buyers wanting to buy — pressure up.
        <span className="font-semibold text-ink"> Supply</span> is sellers wanting to sell — pressure down. Price rises
        when demand beats supply, and falls when supply beats demand.
      </p>
      <ul className="mt-8 space-y-4 border-l border-ink/15 pl-5">
        <li>
          <p className="font-heading text-base font-semibold text-ink">Demand</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            People eager to buy. They bid higher to get filled — that lifts price.
          </p>
        </li>
        <li>
          <p className="font-heading text-base font-semibold text-ink">Supply</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            People eager to sell. They offer lower to get out or short — that presses price down.
          </p>
        </li>
        <li>
          <p className="font-heading text-base font-semibold text-ink">Zones</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            Places on the chart where price bounced hard (demand) or dropped hard (supply) before. Traders watch those
            areas for the next reaction — still not a guaranteed signal.
          </p>
        </li>
      </ul>
      <div className="mt-8 rounded-md border border-ink/10 bg-white/55 px-4 py-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-ink">Balance the pressure</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mark">Drag</p>
        </div>
        <div className="mt-3 flex justify-between font-mono text-[11px] uppercase tracking-wide">
          <span className="text-[#b42318]">More supply</span>
          <span className="text-mark">More demand</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={balance}
          onChange={(event) => onBalanceChange(Number(event.target.value))}
          aria-label="Balance supply and demand"
          className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-[#b42318]/35 via-ink/10 to-mark/40 accent-[var(--mark)]"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p
            className={cn(
              "rounded-md px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wide",
              demandHeavy && "bg-mark/15 text-mark",
              supplyHeavy && "bg-[#b42318]/12 text-[#b42318]",
              !demandHeavy && !supplyHeavy && "bg-ink/10 text-ink/65",
            )}
          >
            {badge}
          </p>
          <p className="text-sm leading-relaxed text-ink/65">{hint}</p>
        </div>
      </div>

      <ZoneMarkingSteps />
    </div>
  );
}

function RiskStep() {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">Risk is the real skill</h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        New traders ask &ldquo;where will it go?&rdquo; DreamTrades starts with &ldquo;how much can I lose if I am
        wrong?&rdquo;
      </p>
      <RiskIllustration />
      <ul className="mt-8 space-y-4 border-l border-ink/15 pl-5">
        <li>
          <p className="font-heading text-base font-semibold text-ink">Stop loss</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            The price where you exit if the trade fails. Set it before you enter — not after you panic.
          </p>
        </li>
        <li>
          <p className="font-heading text-base font-semibold text-ink">Position size</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            How big the trade is. Bigger size means bigger gain — and bigger damage. Size to the stop, not to the hope.
          </p>
        </li>
        <li>
          <p className="font-heading text-base font-semibold text-ink">Survivable money</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            Never risk rent, bills, or money that changes your life if it is gone. Practice on small size until the
            process is calm.
          </p>
        </li>
      </ul>
    </div>
  );
}

function RiskAside() {
  return (
    <div className="mt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">Order of ops</p>
      <ol className="mt-3 space-y-2 text-sm leading-relaxed text-ink/65">
        <li>1 · Where am I wrong? (stop)</li>
        <li>2 · How big can I survive?</li>
        <li>3 · Only then — entry</li>
      </ol>
    </div>
  );
}

function UnlockVipBanner({ readyCount, total }: { readyCount: number; total: number }) {
  return (
    <div
      className="unlock-pulse relative overflow-hidden rounded-md border-2 border-mark bg-[linear-gradient(135deg,#041512_0%,#0a3d35_48%,#0f9f8a_140%)] px-5 py-5 text-[#f4f7f8] shadow-[0_12px_40px_-16px_rgba(15,159,138,0.65)] md:px-6 md:py-6"
      role="status"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[radial-gradient(circle,#14b8a066,transparent_70%)]"
        aria-hidden
      />
      <p className="relative font-mono text-[11px] uppercase tracking-[0.22em] text-[#9be7d8]">
        VIP unlock · almost there
      </p>
      <p className="relative mt-2 font-heading text-xl font-bold tracking-tight md:text-2xl">
        Tick every box to unlock Telegram VIP & WhatsApp
      </p>
      <p className="relative mt-2 max-w-xl text-sm leading-relaxed text-[#f4f7f8]/78 md:text-base">
        Finish the checklist — then your community QRs and join links appear. This is your starter-pack finish line.
      </p>
      <div className="relative mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-sm bg-[#f4f7f8] px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
          {readyCount}/{total} checked
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9be7d8]">
          {total - readyCount === 0
            ? "Unlocked"
            : `${total - readyCount} left to unlock`}
        </span>
      </div>
      <div
        className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-black/30"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={readyCount}
        aria-label="Checklist progress toward VIP unlock"
      >
        <div
          className="h-full rounded-full bg-[#f4f7f8] transition-[width] duration-300 ease-out"
          style={{ width: `${(readyCount / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function ChecklistStep({
  checked,
  onToggle,
  readyCount,
  complete,
}: {
  checked: boolean[];
  onToggle: (index: number) => void;
  readyCount: number;
  complete: boolean;
}) {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">Before you click buy or sell</h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        Tick every box. If you cannot — sit out. Sitting out is a trading skill.
      </p>
      {!complete && (
        <div className="mt-6">
          <UnlockVipBanner readyCount={readyCount} total={CHECKLIST.length} />
        </div>
      )}
      <ChecklistIllustration />
      <ul className="mt-8 space-y-3">
        {CHECKLIST.map((item, index) => (
          <li key={item}>
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors",
                checked[index]
                  ? "border-mark/50 bg-[color-mix(in_srgb,#0f9f8a_10%,white)]"
                  : "border-ink/10 bg-white/50 hover:border-mark/40",
              )}
            >
              <input
                type="checkbox"
                checked={checked[index]}
                onChange={() => onToggle(index)}
                className="mt-1 size-4 accent-[var(--mark)]"
              />
              <span className="text-sm leading-relaxed text-ink/80">{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className={cn("mt-6 font-mono text-sm", complete ? "text-mark" : "text-ink/50")}>
        {complete
          ? "Ready — you have a plan. Join the rooms below."
          : `Not ready yet — ${readyCount}/${CHECKLIST.length} checked. Finish the list or skip the trade.`}
      </p>
      {complete && <GraduationPanel className="mt-6" />}
    </div>
  );
}
