/** Teaching SVGs for the DreamTrades curriculum — picture-first, beginner-clear. */

import type { ReactNode } from "react";

const sheet = "#f4f7f8";
const ink = "#11161d";
const mute = "#516070";
const mark = "#0f9f8a";
const flare = "#e85d4c";
const softMark = "#0f9f8a33";
const softFlare = "#e85d4c33";

function Frame({
  children,
  viewBox,
  label,
  className = "mt-3 w-full max-w-md",
}: {
  children: ReactNode;
  viewBox: string;
  label: string;
  className?: string;
}) {
  const [w, h] = viewBox.split(" ").slice(2).map(Number);
  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={label}>
      <rect width={w} height={h} fill={sheet} rx="4" />
      {children}
    </svg>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">
      {children}
    </p>
  );
}

/** Lesson 01 — what a trade is */
export function TradeIllustration() {
  return (
    <div className="mt-8">
      <Caption>Picture · a trade</Caption>
      <Frame viewBox="0 0 360 200" label="Buyer and seller exchange at an entry, then exit later">
        <text x="24" y="28" fontSize="12" fill={mute} fontFamily="monospace">
          Same market · two sides
        </text>
        {/* Buyer */}
        <rect x="24" y="48" width="120" height="88" fill="#ffffff" stroke="#11161d22" strokeWidth="1" rx="4" />
        <text x="40" y="72" fontSize="13" fill={mark} fontFamily="Syne, sans-serif" fontWeight="700">
          Buyer
        </text>
        <text x="40" y="94" fontSize="11" fill={ink} fontFamily="monospace">
          wants price ↑
        </text>
        <text x="40" y="116" fontSize="11" fill={mute} fontFamily="monospace">
          opens LONG
        </text>
        {/* Seller */}
        <rect x="216" y="48" width="120" height="88" fill="#ffffff" stroke="#11161d22" strokeWidth="1" rx="4" />
        <text x="232" y="72" fontSize="13" fill={flare} fontFamily="Syne, sans-serif" fontWeight="700">
          Seller
        </text>
        <text x="232" y="94" fontSize="11" fill={ink} fontFamily="monospace">
          wants price ↓
        </text>
        <text x="232" y="116" fontSize="11" fill={mute} fontFamily="monospace">
          opens SHORT
        </text>
        {/* Arrow between */}
        <path d="M152 92 H208" stroke={ink} strokeWidth="1.5" markerEnd="url(#arrowTrade)" />
        <defs>
          <marker id="arrowTrade" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={ink} />
          </marker>
        </defs>
        <text x="160" y="84" fontSize="10" fill={mute} fontFamily="monospace">
          trade
        </text>
        {/* Entry / exit line */}
        <line x1="40" y1="168" x2="320" y2="168" stroke="#11161d22" strokeWidth="1" />
        <circle cx="90" cy="168" r="5" fill={flare} />
        <text x="70" y="188" fontSize="10" fill={mute} fontFamily="monospace">
          entry
        </text>
        <circle cx="270" cy="168" r="5" fill={mark} />
        <text x="250" y="188" fontSize="10" fill={mute} fontFamily="monospace">
          exit
        </text>
        <path d="M98 168 H262" stroke={mark} strokeWidth="2" strokeDasharray="4 3" />
      </Frame>
      <ol className="mt-4 space-y-2 border-l border-ink/15 pl-4 text-sm leading-relaxed text-ink/65">
        <li><span className="font-semibold text-ink">1.</span> Pick a direction (up or down).</li>
        <li><span className="font-semibold text-ink">2.</span> Enter at a price — that is your open.</li>
        <li><span className="font-semibold text-ink">3.</span> Exit later — the gap is profit or loss.</li>
      </ol>
    </div>
  );
}

/** Lesson 02 — long vs short paths */
export function DirectionIllustration({ side }: { side: "long" | "short" }) {
  const long = side === "long";
  return (
    <div className="mt-8">
      <Caption>Picture · {long ? "long" : "short"} path</Caption>
      <Frame viewBox="0 0 360 180" label={long ? "Rising price helps a long trade" : "Falling price helps a short trade"}>
        <line x1="32" y1="148" x2="328" y2="148" stroke="#11161d22" strokeWidth="1" />
        {long ? (
          <>
            <path
              d="M40 130 C 90 125, 130 95, 180 70 C 230 45, 280 35, 320 22"
              fill="none"
              stroke={mark}
              strokeWidth="2.5"
              className="chart-line"
            />
            <circle cx="80" cy="122" r="5" fill={flare} />
            <text x="90" y="116" fontSize="11" fill={ink} fontFamily="monospace">
              buy here
            </text>
            <circle cx="300" cy="28" r="5" fill={mark} />
            <text x="210" y="24" fontSize="11" fill={mark} fontFamily="monospace">
              price up → profit
            </text>
          </>
        ) : (
          <>
            <path
              d="M40 40 C 90 45, 130 75, 180 100 C 230 125, 280 135, 320 148"
              fill="none"
              stroke={flare}
              strokeWidth="2.5"
              className="chart-line"
            />
            <circle cx="80" cy="48" r="5" fill={flare} />
            <text x="90" y="42" fontSize="11" fill={ink} fontFamily="monospace">
              sell here
            </text>
            <circle cx="300" cy="142" r="5" fill={mark} />
            <text x="200" y="168" fontSize="11" fill={mark} fontFamily="monospace">
              price down → profit
            </text>
          </>
        )}
        <text x="32" y="22" fontSize="12" fill={long ? mark : flare} fontFamily="monospace">
          {long ? "LONG = buy first, hope higher" : "SHORT = sell first, hope lower"}
        </text>
      </Frame>
    </div>
  );
}

/** Lesson 03 — pairs anatomy */
export function PairsIllustration() {
  return (
    <div className="mt-8">
      <Caption>Picture · reading a pair</Caption>
      <Frame viewBox="0 0 360 170" label="XAUUSD means gold priced in US dollars">
        <text x="24" y="28" fontSize="12" fill={mute} fontFamily="monospace">
          Pair = base / quote
        </text>
        <rect x="40" y="48" width="100" height="72" fill={softMark} stroke={mark} strokeWidth="1.5" rx="4" />
        <text x="58" y="78" fontSize="22" fill={ink} fontFamily="Syne, sans-serif" fontWeight="700">
          XAU
        </text>
        <text x="58" y="102" fontSize="11" fill={mute} fontFamily="monospace">
          gold (base)
        </text>
        <text x="158" y="90" fontSize="28" fill={ink} fontFamily="Syne, sans-serif" fontWeight="700">
          /
        </text>
        <rect x="200" y="48" width="120" height="72" fill="#ffffff" stroke="#11161d33" strokeWidth="1.5" rx="4" />
        <text x="220" y="78" fontSize="22" fill={ink} fontFamily="Syne, sans-serif" fontWeight="700">
          USD
        </text>
        <text x="220" y="102" fontSize="11" fill={mute} fontFamily="monospace">
          dollars (quote)
        </text>
        <text x="40" y="150" fontSize="12" fill={ink} fontFamily="monospace">
          Number on the chart = dollars per 1 oz gold
        </text>
      </Frame>
      <ol className="mt-4 space-y-2 border-l border-ink/15 pl-4 text-sm leading-relaxed text-ink/65">
        <li><span className="font-semibold text-ink">1.</span> Left side (XAU) is what you are pricing.</li>
        <li><span className="font-semibold text-ink">2.</span> Right side (USD) is the currency used to price it.</li>
        <li><span className="font-semibold text-ink">3.</span> When the number rises, gold costs more dollars.</li>
      </ol>
    </div>
  );
}

/** Lesson 04 — candles */
export function CandlesIllustration() {
  return (
    <div className="mt-8">
      <Caption>Picture · green vs red candle</Caption>
      <Frame viewBox="0 0 360 200" label="Bullish and bearish candlesticks labeled open high low close" className="mt-3 w-full max-w-lg">
        {/* Green candle */}
        <line x1="90" y1="28" x2="90" y2="170" stroke="#11161d55" strokeWidth="2" />
        <rect x="68" y="60" width="44" height="70" fill={mark} />
        <text x="40" y="24" fontSize="11" fill={mark} fontFamily="monospace">
          closed higher
        </text>
        <text x="120" y="36" fontSize="10" fill={mute} fontFamily="monospace">
          high
        </text>
        <text x="120" y="78" fontSize="10" fill={mute} fontFamily="monospace">
          close
        </text>
        <text x="120" y="120" fontSize="10" fill={mute} fontFamily="monospace">
          open
        </text>
        <text x="120" y="174" fontSize="10" fill={mute} fontFamily="monospace">
          low
        </text>
        {/* Red candle */}
        <line x1="250" y1="36" x2="250" y2="162" stroke="#11161d55" strokeWidth="2" />
        <rect x="228" y="55" width="44" height="70" fill={flare} />
        <text x="210" y="24" fontSize="11" fill={flare} fontFamily="monospace">
          closed lower
        </text>
        <text x="282" y="44" fontSize="10" fill={mute} fontFamily="monospace">
          high
        </text>
        <text x="282" y="72" fontSize="10" fill={mute} fontFamily="monospace">
          open
        </text>
        <text x="282" y="118" fontSize="10" fill={mute} fontFamily="monospace">
          close
        </text>
        <text x="282" y="166" fontSize="10" fill={mute} fontFamily="monospace">
          low
        </text>
      </Frame>
      <ol className="mt-4 space-y-2 border-l border-ink/15 pl-4 text-sm leading-relaxed text-ink/65">
        <li><span className="font-semibold text-ink">1.</span> Body = open to close.</li>
        <li><span className="font-semibold text-ink">2.</span> Wicks = the high and low stretch.</li>
        <li><span className="font-semibold text-ink">3.</span> Green usually closed up; red usually closed down.</li>
      </ol>
    </div>
  );
}

const ZONE_STEPS = [
  {
    n: "1",
    title: "Find the impulse",
    body: "Look for a sharp move — a strong push up or drop down. That energy left a footprint.",
  },
  {
    n: "2",
    title: "Mark the base / origin",
    body: "Find the small pause or consolidation right before that impulse. That rectangle is the zone’s birthplace.",
  },
  {
    n: "3",
    title: "Extend the zone",
    body: "Draw the zone’s high and low across the chart to the right. Keep it as a band, not a single line.",
  },
  {
    n: "4",
    title: "Wait for the retest",
    body: "Do nothing until price comes back to touch the zone. Reaction there is the lesson — not a guaranteed win.",
  },
] as const;

/** Lesson 05 — supply & demand zone marking (numbered steps) */
export function ZoneMarkingSteps() {
  return (
    <div className="mt-10">
      <Caption>How to mark a zone · 4 steps</Caption>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65">
        Zones are places price left in a hurry. Mark them with pictures — then wait. Below is a demand-zone
        example (same idea upside-down for supply).
      </p>

      <div className="mt-6 grid gap-6">
        {/* Step 1 */}
        <div>
          <StepHeading n="1" title="Find the impulse" />
          <Frame viewBox="0 0 360 140" label="Step 1: sharp upward impulse move on a chart">
            <line x1="24" y1="118" x2="336" y2="118" stroke="#11161d18" strokeWidth="1" />
            <path
              d="M28 100 C 70 98, 100 96, 130 92 L 140 88 L 200 40 L 260 28 L 320 22"
              fill="none"
              stroke={ink}
              strokeWidth="2.2"
            />
            <path d="M140 88 L 200 40" stroke={mark} strokeWidth="4" strokeLinecap="round" />
            <text x="168" y="58" fontSize="11" fill={mark} fontFamily="monospace" fontWeight="700">
              IMPULSE ↑
            </text>
            <text x="24" y="24" fontSize="11" fill={mute} fontFamily="monospace">
              Sharp move = interest showed up
            </text>
          </Frame>
          <p className="mt-2 text-sm text-ink/65">{ZONE_STEPS[0].body}</p>
        </div>

        {/* Step 2 */}
        <div>
          <StepHeading n="2" title="Mark the base / origin" />
          <Frame viewBox="0 0 360 150" label="Step 2: mark the base consolidation before the impulse">
            <line x1="24" y1="128" x2="336" y2="128" stroke="#11161d18" strokeWidth="1" />
            <rect x="70" y="88" width="72" height="28" fill={softMark} stroke={mark} strokeWidth="1.5" />
            <text x="78" y="106" fontSize="10" fill={mark} fontFamily="monospace">
              BASE
            </text>
            <path
              d="M28 110 C 50 108, 60 100, 70 98 L 100 96 L 140 94 L 150 90 L 210 42 L 270 30 L 330 24"
              fill="none"
              stroke={ink}
              strokeWidth="2.2"
            />
            <circle cx="105" cy="102" r="4" fill={mark} />
            <text x="24" y="24" fontSize="11" fill={mute} fontFamily="monospace">
              Origin of the move = the zone
            </text>
            <path d="M106 80 L106 88" stroke={mark} strokeWidth="1.5" />
            <text x="112" y="78" fontSize="10" fill={mark} fontFamily="monospace">
              mark this box
            </text>
          </Frame>
          <p className="mt-2 text-sm text-ink/65">{ZONE_STEPS[1].body}</p>
        </div>

        {/* Step 3 */}
        <div>
          <StepHeading n="3" title="Extend the zone" />
          <Frame viewBox="0 0 360 150" label="Step 3: extend the demand zone forward across the chart">
            <line x1="24" y1="128" x2="336" y2="128" stroke="#11161d18" strokeWidth="1" />
            <rect x="70" y="88" width="250" height="28" fill={softMark} stroke={mark} strokeWidth="1.5" strokeDasharray="5 3" />
            <text x="200" y="106" fontSize="10" fill={mark} fontFamily="monospace">
              DEMAND ZONE →
            </text>
            <path
              d="M28 110 C 50 108, 60 100, 70 98 L 100 96 L 140 94 L 150 90 L 210 42 L 270 30 L 300 36"
              fill="none"
              stroke={ink}
              strokeWidth="2.2"
            />
            <text x="24" y="24" fontSize="11" fill={mute} fontFamily="monospace">
              Stretch the band to the right
            </text>
          </Frame>
          <p className="mt-2 text-sm text-ink/65">{ZONE_STEPS[2].body}</p>
        </div>

        {/* Step 4 */}
        <div>
          <StepHeading n="4" title="Wait for the retest" />
          <Frame viewBox="0 0 360 160" label="Step 4: price returns to retest the demand zone">
            <line x1="24" y1="136" x2="336" y2="136" stroke="#11161d18" strokeWidth="1" />
            <rect x="70" y="96" width="250" height="28" fill={softMark} stroke={mark} strokeWidth="1.5" />
            <text x="80" y="114" fontSize="10" fill={mark} fontFamily="monospace">
              DEMAND
            </text>
            <path
              d="M28 118 C 50 116, 70 106, 100 104 L 140 102 L 160 96 L 210 48 L 250 36 L 280 50 L 300 100 L 310 108 L 330 70"
              fill="none"
              stroke={ink}
              strokeWidth="2.2"
            />
            <circle cx="305" cy="106" r="5" fill={flare} />
            <text x="230" y="90" fontSize="11" fill={flare} fontFamily="monospace" fontWeight="700">
              RETEST
            </text>
            <text x="24" y="24" fontSize="11" fill={mute} fontFamily="monospace">
              Price comes back — watch the reaction
            </text>
            <path d="M320 70 L328 55" stroke={mark} strokeWidth="2" />
            <text x="280" y="48" fontSize="10" fill={mark} fontFamily="monospace">
              bounce?
            </text>
          </Frame>
          <p className="mt-2 text-sm text-ink/65">{ZONE_STEPS[3].body}</p>
        </div>
      </div>

      {/* Supply mirror note */}
      <div className="mt-8">
        <Caption>Supply zone · same steps, flipped</Caption>
        <Frame viewBox="0 0 360 140" label="Supply zone: impulse down from a base near the highs">
          <rect x="70" y="24" width="250" height="26" fill={softFlare} stroke={flare} strokeWidth="1.5" />
          <text x="80" y="41" fontSize="10" fill={flare} fontFamily="monospace">
            SUPPLY ZONE
          </text>
          <path
            d="M28 40 C 50 38, 70 36, 100 38 L 140 42 L 160 48 L 210 100 L 250 112 L 280 100 L 300 48 L 320 40"
            fill="none"
            stroke={ink}
            strokeWidth="2.2"
          />
          <circle cx="300" cy="48" r="5" fill={flare} />
          <text x="220" y="70" fontSize="11" fill={flare} fontFamily="monospace">
            retest → drop?
          </text>
          <text x="24" y="128" fontSize="11" fill={mute} fontFamily="monospace">
            Impulse down → mark high base → extend → wait
          </text>
        </Frame>
      </div>
    </div>
  );
}

function StepHeading({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-2 flex items-baseline gap-3">
      <span className="font-mono text-sm font-semibold text-mark">{n}</span>
      <h4 className="font-heading text-lg font-semibold tracking-tight text-ink">{title}</h4>
    </div>
  );
}

/** Compact aside sketch for S&D remember column */
export function ZoneSketchAside() {
  return (
    <div className="mt-8">
      <Caption>Chart sketch · zones</Caption>
      <svg viewBox="0 0 280 170" className="mt-3 w-full max-w-sm" role="img" aria-label="Simple chart with a demand zone bounce and a supply zone drop">
        <rect width="280" height="170" fill={sheet} />
        <rect x="16" y="28" width="248" height="28" fill={softFlare} />
        <text x="24" y="46" fontSize="10" fill={flare} fontFamily="monospace">
          SUPPLY ZONE
        </text>
        <rect x="16" y="118" width="248" height="28" fill={softMark} />
        <text x="24" y="136" fontSize="10" fill={mark} fontFamily="monospace">
          DEMAND ZONE
        </text>
        <path
          d="M24 124 C 50 122, 70 118, 90 90 S 130 48, 160 40 S 200 38, 220 42 S 250 78, 264 102"
          fill="none"
          stroke={ink}
          strokeWidth="2.2"
        />
        <circle cx="90" cy="120" r="4" fill={mark} />
        <circle cx="220" cy="42" r="4" fill={flare} />
        <text x="98" y="114" fontSize="10" fill={mark} fontFamily="monospace">
          bounce
        </text>
        <text x="226" y="38" fontSize="10" fill={flare} fontFamily="monospace">
          drop
        </text>
      </svg>
      <ol className="mt-4 space-y-1.5 text-xs leading-relaxed text-ink/60">
        <li>1 · impulse</li>
        <li>2 · mark base</li>
        <li>3 · extend zone</li>
        <li>4 · wait for retest</li>
      </ol>
    </div>
  );
}

/** Lesson 06 — risk */
export function RiskIllustration() {
  return (
    <div className="mt-8">
      <Caption>Picture · stop, size, survive</Caption>
      <Frame viewBox="0 0 360 190" label="Trade plan with entry, stop loss, and target" className="mt-3 w-full max-w-lg">
        <line x1="40" y1="40" x2="40" y2="160" stroke="#11161d22" strokeWidth="1" />
        {/* Target */}
        <line x1="40" y1="48" x2="300" y2="48" stroke={mark} strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="48" y="40" fontSize="11" fill={mark} fontFamily="monospace">
          target (optional)
        </text>
        {/* Entry */}
        <line x1="40" y1="96" x2="300" y2="96" stroke={ink} strokeWidth="2" />
        <circle cx="120" cy="96" r="5" fill={flare} />
        <text x="130" y="92" fontSize="11" fill={ink} fontFamily="monospace">
          entry
        </text>
        {/* Stop */}
        <line x1="40" y1="148" x2="300" y2="148" stroke={flare} strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="48" y="168" fontSize="11" fill={flare} fontFamily="monospace">
          stop loss — exit if wrong
        </text>
        {/* Risk bracket */}
        <path d="M310 96 V148" stroke={flare} strokeWidth="1.5" />
        <text x="316" y="126" fontSize="10" fill={flare} fontFamily="monospace">
          risk
        </text>
        {/* Reward bracket */}
        <path d="M310 48 V96" stroke={mark} strokeWidth="1.5" />
        <text x="316" y="76" fontSize="10" fill={mark} fontFamily="monospace">
          reward
        </text>
      </Frame>
      <ol className="mt-4 space-y-2 border-l border-ink/15 pl-4 text-sm leading-relaxed text-ink/65">
        <li><span className="font-semibold text-ink">1.</span> Place the stop first — where the idea is wrong.</li>
        <li><span className="font-semibold text-ink">2.</span> Size the trade so that stop is survivable.</li>
        <li><span className="font-semibold text-ink">3.</span> Never risk money you need for life (rent, bills).</li>
      </ol>
    </div>
  );
}

/** Lesson 07 — checklist */
export function ChecklistIllustration() {
  return (
    <div className="mt-8">
      <Caption>Picture · decide, then click</Caption>
      <Frame viewBox="0 0 360 130" label="Flow from checklist to calm trade execution">
        <rect x="24" y="36" width="90" height="56" fill="#ffffff" stroke="#11161d22" strokeWidth="1" rx="4" />
        <text x="38" y="60" fontSize="12" fill={ink} fontFamily="Syne, sans-serif" fontWeight="700">
          Plan
        </text>
        <text x="38" y="78" fontSize="10" fill={mute} fontFamily="monospace">
          tick boxes
        </text>
        <path d="M122 64 H148" stroke={ink} strokeWidth="1.5" markerEnd="url(#arrowCheck)" />
        <rect x="156" y="36" width="90" height="56" fill={softMark} stroke={mark} strokeWidth="1.5" rx="4" />
        <text x="170" y="60" fontSize="12" fill={ink} fontFamily="Syne, sans-serif" fontWeight="700">
          Ready
        </text>
        <text x="170" y="78" fontSize="10" fill={mute} fontFamily="monospace">
          all checked
        </text>
        <path d="M254 64 H280" stroke={ink} strokeWidth="1.5" markerEnd="url(#arrowCheck)" />
        <rect x="288" y="36" width="56" height="56" fill={ink} rx="4" />
        <text x="298" y="68" fontSize="12" fill="#f4f7f8" fontFamily="Syne, sans-serif" fontWeight="700">
          Act
        </text>
        <defs>
          <marker id="arrowCheck" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={ink} />
          </marker>
        </defs>
        <text x="24" y="118" fontSize="11" fill={mute} fontFamily="monospace">
          Incomplete list → sit out (that is a skill)
        </text>
      </Frame>
    </div>
  );
}
