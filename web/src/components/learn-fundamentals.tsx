"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "trade", label: "A trade", short: "01" },
  { id: "direction", label: "Long & short", short: "02" },
  { id: "pairs", label: "Pairs", short: "03" },
  { id: "candles", label: "Candles", short: "04" },
  { id: "risk", label: "Risk", short: "05" },
  { id: "checklist", label: "Checklist", short: "06" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const CHECKLIST = [
  "I know if I am buying (long) or selling (short).",
  "I know why this level or idea matters — not just a tip.",
  "I set a stop loss before I enter.",
  "The money I risk is money I can lose without stress.",
  "Position size fits my stop — not hope.",
  "I have a plan to exit if I am wrong.",
];

export function LearnFundamentals({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<StepId>("trade");
  const [side, setSide] = useState<"long" | "short">("long");
  const [checked, setChecked] = useState<boolean[]>(() =>
    CHECKLIST.map(() => false),
  );

  const activeIndex = STEPS.findIndex((s) => s.id === active);
  const readyCount = checked.filter(Boolean).length;

  function go(delta: number) {
    const next = Math.min(STEPS.length - 1, Math.max(0, activeIndex + delta));
    setActive(STEPS[next].id);
  }

  return (
    <div className={cn(!compact && "pb-8")}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
            Learn · fundamentals
          </p>
          <h2
            className={cn(
              "mt-3 font-heading font-semibold tracking-tight text-ink",
              compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl",
            )}
          >
            Trading, in plain English
          </h2>
          <p className="mt-4 text-ink/65 md:text-lg">
            Six ideas. No jargon left unexplained. Read once before you risk a
            dollar on the LJ CIRCLE desk.
          </p>
        </div>

        <nav
          aria-label="Learn steps"
          className="mt-10 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {STEPS.map((step, index) => {
            const isActive = step.id === active;
            const isPast = index < activeIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActive(step.id)}
                className={cn(
                  "shrink-0 border-b-2 px-3 py-2 text-left transition-colors",
                  isActive
                    ? "border-gold text-ink"
                    : isPast
                      ? "border-ink/25 text-ink/70 hover:text-ink"
                      : "border-transparent text-ink/45 hover:text-ink/70",
                )}
              >
                <span className="font-mono text-[11px] tracking-wider text-gold">
                  {step.short}
                </span>
                <span className="mt-0.5 block text-sm font-medium">
                  {step.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div
          key={active}
          className="animate-rise mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start"
        >
          <div>
            {active === "trade" && <TradeStep />}
            {active === "direction" && (
              <DirectionStep side={side} onSideChange={setSide} />
            )}
            {active === "pairs" && <PairsStep />}
            {active === "candles" && <CandlesStep />}
            {active === "risk" && <RiskStep />}
            {active === "checklist" && (
              <ChecklistStep
                checked={checked}
                onToggle={(i) =>
                  setChecked((prev) =>
                    prev.map((v, idx) => (idx === i ? !v : v)),
                  )
                }
                readyCount={readyCount}
              />
            )}
          </div>

          <aside className="border-t border-ink/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
              Remember
            </p>
            <p className="mt-3 font-heading text-xl font-semibold tracking-tight text-ink">
              {REMEMBER[active].title}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              {REMEMBER[active].body}
            </p>
            {active === "direction" && (
              <LongShortDemo side={side} />
            )}
            {active === "candles" && <CandleDiagram />}
            {active === "checklist" && (
              <p className="mt-6 font-mono text-xs text-ink/50">
                {readyCount}/{CHECKLIST.length} checked
              </p>
            )}
          </aside>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-8">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={activeIndex === 0}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-sm border-ink/20 bg-transparent px-5 text-ink disabled:opacity-40",
            )}
          >
            Previous
          </button>
          <p className="font-mono text-xs text-ink/45">
            Step {activeIndex + 1} of {STEPS.length}
          </p>
          {activeIndex < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => go(1)}
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-sm bg-[#c4a35a] px-5 text-ink hover:bg-[#e8d19a]",
              )}
            >
              Next idea
            </button>
          ) : (
            <Link
              href="/#xauusd"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-sm bg-[#c4a35a] px-5 text-ink hover:bg-[#e8d19a]",
              )}
            >
              Open the live desk
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

const REMEMBER: Record<StepId, { title: string; body: string }> = {
  trade: {
    title: "You are exchanging risk for a chance at profit.",
    body: "Every trade has a buyer and a seller. One side is right about the next move — protect yourself so being wrong is survivable.",
  },
  direction: {
    title: "Profit comes from being right about direction.",
    body: "Long wins if price rises. Short wins if price falls. Toggle the demo — watch how the same move helps or hurts you.",
  },
  pairs: {
    title: "XAUUSD is gold priced in US dollars.",
    body: "On this desk, gold is the main focus. When you read XAUUSD, you are watching how many dollars one ounce of gold costs.",
  },
  candles: {
    title: "One candle = one period of price action.",
    body: "Open, high, low, close. Green usually means the period closed higher than it opened. Red means it closed lower.",
  },
  risk: {
    title: "Survive first. Profit second.",
    body: "A stop loss is your exit if you are wrong. Position size is how much you put on the line. Never risk rent, bills, or money that changes your life if it is gone.",
  },
  checklist: {
    title: "If you skip the checklist, skip the trade.",
    body: "Discipline beats excitement. Tick every box before you click buy or sell — then review the live XAUUSD desk with a clear head.",
  },
};

function TradeStep() {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        What is a trade?
      </h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        A trade is a bet that a price will move — you{" "}
        <span className="font-semibold text-ink">buy</span> if you think it
        goes up, or <span className="font-semibold text-ink">sell</span> if you
        think it goes down.
      </p>
      <ul className="mt-8 space-y-4 border-l border-ink/15 pl-5">
        <li>
          <p className="font-heading text-base font-semibold text-ink">
            Market
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            The place prices are agreed — gold, currencies, stocks. LJ CIRCLE
            watches gold and major forex pairs.
          </p>
        </li>
        <li>
          <p className="font-heading text-base font-semibold text-ink">
            Entry & exit
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            You open a position at one price and close it later at another. The
            difference (minus costs) is your profit or loss.
          </p>
        </li>
        <li>
          <p className="font-heading text-base font-semibold text-ink">
            Not a casino tip
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            Charts and signals help attention. They do not remove risk. Your job
            is to decide with a plan — not chase every move.
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
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Price goes up or down
      </h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        <span className="font-semibold text-ink">Long</span> means you buy —
        you want price higher.{" "}
        <span className="font-semibold text-ink">Short</span> means you sell
        first — you want price lower.
      </p>

      <div className="mt-8 inline-flex rounded-sm border border-ink/15 p-1">
        <button
          type="button"
          onClick={() => onSideChange("long")}
          className={cn(
            "px-5 py-2.5 text-sm font-semibold transition-colors",
            side === "long"
              ? "bg-tide text-[#f4f7fb]"
              : "text-ink/55 hover:text-ink",
          )}
        >
          Long (buy)
        </button>
        <button
          type="button"
          onClick={() => onSideChange("short")}
          className={cn(
            "px-5 py-2.5 text-sm font-semibold transition-colors",
            side === "short"
              ? "bg-ink text-[#f4f7fb]"
              : "text-ink/55 hover:text-ink",
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
    </div>
  );
}

function LongShortDemo({ side }: { side: "long" | "short" }) {
  const upHelps = side === "long";
  return (
    <div className="mt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">
        Demo · same price rise
      </p>
      <svg
        viewBox="0 0 280 120"
        className="mt-3 w-full max-w-sm"
        role="img"
        aria-label={
          upHelps
            ? "Rising price line helps a long trade"
            : "Rising price line hurts a short trade"
        }
      >
        <rect width="280" height="120" fill="#f4f7fb" />
        <line
          x1="24"
          y1="96"
          x2="256"
          y2="96"
          stroke="#0a162822"
          strokeWidth="1"
        />
        <path
          d="M28 88 C 70 86, 90 70, 120 58 C 150 46, 170 40, 210 28 L 248 18"
          fill="none"
          stroke="#0d8a6f"
          strokeWidth="2.5"
          className="chart-line"
        />
        <circle cx="70" cy="78" r="4" fill="#c4a35a" />
        <text x="78" y="72" fontSize="10" fill="#0a1628" fontFamily="monospace">
          entry
        </text>
        <text
          x="24"
          y="16"
          fontSize="11"
          fill={upHelps ? "#0d8a6f" : "#b42318"}
          fontFamily="monospace"
        >
          {upHelps ? "Price up → long profits" : "Price up → short loses"}
        </text>
      </svg>
    </div>
  );
}

function PairsStep() {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Pairs — and why XAUUSD matters here
      </h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        Forex and gold are quoted as{" "}
        <span className="font-semibold text-ink">pairs</span>: how much of one
        thing buys one of another.
      </p>
      <div className="mt-8 space-y-5">
        <div className="border-t border-ink/15 pt-5">
          <p className="font-mono text-xs text-gold">XAUUSD</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            <span className="font-semibold text-ink">XAU</span> = gold.{" "}
            <span className="font-semibold text-ink">USD</span> = US dollar. The
            number is dollars per ounce of gold. This is the main pair on the LJ
            CIRCLE desk.
          </p>
        </div>
        <div className="border-t border-ink/15 pt-5">
          <p className="font-mono text-xs text-gold">EURUSD</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            How many dollars one euro buys. Majors like this sit beside gold so
            you can see the wider forex picture — without leaving the desk.
          </p>
        </div>
        <div className="border-t border-ink/15 pt-5">
          <p className="font-mono text-xs text-gold">Why focus?</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            Attention beats watching everything. Live price + TradingView +
            Telegram stay centered on gold so you practice one market deeply.
          </p>
        </div>
      </div>
    </div>
  );
}

function CandlesStep() {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Charts in 60 seconds
      </h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        A <span className="font-semibold text-ink">candlestick</span> shows what
        price did in one time slice — open, high, low, and close.
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          ["Open", "Price when the period started."],
          ["High", "Highest price during the period."],
          ["Low", "Lowest price during the period."],
          ["Close", "Price when the period ended."],
        ].map(([term, def]) => (
          <div key={term} className="border-t border-ink/15 pt-4">
            <dt className="font-heading text-base font-semibold text-ink">
              {term}
            </dt>
            <dd className="mt-1 text-sm text-ink/65">{def}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm leading-relaxed text-ink/65">
        On TradingView on this site, you are reading those candles over time.
        Zoom out for the big story; zoom in for the next few minutes.
      </p>
    </div>
  );
}

function CandleDiagram() {
  return (
    <div className="mt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">
        Anatomy
      </p>
      <svg
        viewBox="0 0 200 160"
        className="mt-3 w-full max-w-[200px]"
        role="img"
        aria-label="Candlestick: wick high and low, body open and close"
      >
        <line
          x1="80"
          y1="12"
          x2="80"
          y2="148"
          stroke="#0a1628"
          strokeWidth="2"
        />
        <rect x="58" y="40" width="44" height="70" fill="#0d8a6f" />
        <text x="112" y="18" fontSize="10" fill="#4a5d73" fontFamily="monospace">
          High
        </text>
        <text x="112" y="48" fontSize="10" fill="#4a5d73" fontFamily="monospace">
          Close
        </text>
        <text x="112" y="104" fontSize="10" fill="#4a5d73" fontFamily="monospace">
          Open
        </text>
        <text x="112" y="150" fontSize="10" fill="#4a5d73" fontFamily="monospace">
          Low
        </text>
      </svg>
      <p className="mt-2 text-xs text-ink/55">
        Green body here: close above open (period rose).
      </p>
    </div>
  );
}

function RiskStep() {
  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Risk first
      </h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        Before you hunt profit, decide how you will{" "}
        <span className="font-semibold text-ink">lose small</span> when you are
        wrong.
      </p>
      <ul className="mt-8 space-y-5">
        <li className="border-t border-ink/15 pt-5">
          <p className="font-heading text-base font-semibold text-ink">
            Position size
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            How large the trade is. Bigger size = bigger swings in your account.
            Start small until your process is boring and repeatable.
          </p>
        </li>
        <li className="border-t border-ink/15 pt-5">
          <p className="font-heading text-base font-semibold text-ink">
            Stop loss
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            A pre-set price where you exit if the market moves against you. Place
            it when you enter — not after fear takes over.
          </p>
        </li>
        <li className="border-t border-ink/15 pt-5">
          <p className="font-heading text-base font-semibold text-ink">
            Never risk rent money
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/65">
            Only trade with capital you can afford to lose. Pressure from bills
            or “I need this win” destroys decisions. LJ CIRCLE is education and
            attention — not a promise of income.
          </p>
        </li>
      </ul>
    </div>
  );
}

function ChecklistStep({
  checked,
  onToggle,
  readyCount,
}: {
  checked: boolean[];
  onToggle: (index: number) => void;
  readyCount: number;
}) {
  const allReady = readyCount === CHECKLIST.length;

  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        Before you trade
      </h3>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        Tick every line. If one is missing, wait — the next candle will still be
        there.
      </p>
      <ul className="mt-8 space-y-3">
        {CHECKLIST.map((item, index) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => onToggle(index)}
              className={cn(
                "flex w-full items-start gap-3 border-t border-ink/10 px-1 py-3.5 text-left transition-colors",
                checked[index] ? "text-ink" : "text-ink/70 hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[11px]",
                  checked[index]
                    ? "border-tide bg-tide text-[#f4f7fb]"
                    : "border-ink/25 bg-transparent text-transparent",
                )}
                aria-hidden
              >
                ✓
              </span>
              <span className="text-sm leading-relaxed md:text-base">
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p
        className={cn(
          "mt-6 font-mono text-xs uppercase tracking-[0.16em]",
          allReady ? "text-tide" : "text-ink/45",
        )}
      >
        {allReady
          ? "Checklist clear — now review the desk calmly."
          : "Complete the list before live risk."}
      </p>
    </div>
  );
}
