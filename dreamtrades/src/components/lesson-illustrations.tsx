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

/** One real-looking candle: open/high/low/close as SVG y (lower y = higher price). */
function Candle({
  x,
  open,
  high,
  low,
  close,
  w = 9,
}: {
  x: number;
  open: number;
  high: number;
  low: number;
  close: number;
  w?: number;
}) {
  const up = close < open;
  const color = up ? mark : flare;
  const bodyTop = Math.min(open, close);
  const bodyH = Math.max(Math.abs(close - open), 2.5);
  return (
    <g>
      <line x1={x} y1={high} x2={x} y2={low} stroke={color} strokeWidth="1.6" />
      <rect x={x - w / 2} y={bodyTop} width={w} height={bodyH} fill={color} rx="0.5" />
    </g>
  );
}

function CandleSeries({
  candles,
  w = 9,
}: {
  candles: ReadonlyArray<{ x: number; o: number; h: number; l: number; c: number }>;
  w?: number;
}) {
  return (
    <>
      {candles.map((c) => (
        <Candle key={c.x} x={c.x} open={c.o} high={c.h} low={c.l} close={c.c} w={w} />
      ))}
    </>
  );
}

/** Shared demand-zone candle story (base → impulse → optional pullback/retest). */
const DEMAND_BASE = [
  { x: 36, o: 108, h: 100, l: 118, c: 112 },
  { x: 52, o: 112, h: 102, l: 120, c: 106 },
  { x: 68, o: 106, h: 98, l: 116, c: 110 },
  { x: 84, o: 110, h: 100, l: 118, c: 104 },
  { x: 100, o: 104, h: 96, l: 114, c: 108 },
  { x: 116, o: 108, h: 100, l: 116, c: 102 },
] as const;

const DEMAND_IMPULSE = [
  { x: 132, o: 102, h: 78, l: 106, c: 82 },
  { x: 148, o: 82, h: 58, l: 88, c: 62 },
  { x: 164, o: 62, h: 42, l: 70, c: 46 },
  { x: 180, o: 46, h: 30, l: 52, c: 34 },
] as const;

const DEMAND_AFTER_EXTEND = [
  { x: 196, o: 34, h: 26, l: 42, c: 38 },
  { x: 212, o: 38, h: 32, l: 48, c: 44 },
] as const;

const DEMAND_PULLBACK_RETEST = [
  { x: 196, o: 34, h: 28, l: 48, c: 44 },
  { x: 212, o: 44, h: 38, l: 62, c: 58 },
  { x: 228, o: 58, h: 52, l: 78, c: 74 },
  { x: 244, o: 74, h: 68, l: 96, c: 92 },
  { x: 260, o: 92, h: 86, l: 112, c: 106 }, // into demand
  { x: 276, o: 106, h: 88, l: 112, c: 92 }, // bounce candle
  { x: 292, o: 92, h: 70, l: 98, c: 74 },
  { x: 308, o: 74, h: 54, l: 82, c: 58 },
] as const;

const SUPPLY_STORY = [
  { x: 36, o: 42, h: 34, l: 52, c: 48 },
  { x: 52, o: 48, h: 36, l: 54, c: 40 },
  { x: 68, o: 40, h: 32, l: 50, c: 46 },
  { x: 84, o: 46, h: 34, l: 52, c: 38 },
  { x: 100, o: 38, h: 30, l: 48, c: 44 },
  { x: 116, o: 44, h: 32, l: 50, c: 36 }, // base near highs
  { x: 132, o: 36, h: 32, l: 62, c: 58 }, // impulse down starts
  { x: 148, o: 58, h: 54, l: 84, c: 80 },
  { x: 164, o: 80, h: 74, l: 104, c: 98 },
  { x: 180, o: 98, h: 92, l: 118, c: 112 },
  { x: 196, o: 112, h: 100, l: 118, c: 104 },
  { x: 212, o: 104, h: 88, l: 110, c: 92 },
  { x: 228, o: 92, h: 70, l: 98, c: 74 },
  { x: 244, o: 74, h: 52, l: 80, c: 56 },
  { x: 260, o: 56, h: 34, l: 62, c: 40 }, // retest supply
  { x: 276, o: 40, h: 36, l: 68, c: 64 }, // rejection
  { x: 292, o: 64, h: 58, l: 90, c: 86 },
  { x: 308, o: 86, h: 80, l: 112, c: 106 },
] as const;

/** Lesson 05 — supply & demand zone marking (numbered steps) */
export function ZoneMarkingSteps() {
  return (
    <div className="mt-10">
      <Caption>How to mark a zone · 4 steps</Caption>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65">
        Zones are places price left in a hurry. Mark them on a candlestick chart — then wait. Below is a
        demand-zone example (same idea upside-down for supply).
      </p>

      <div className="mt-6 grid gap-6">
        {/* Step 1 */}
        <div>
          <StepHeading n="1" title="Find the impulse" />
          <Frame viewBox="0 0 360 150" label="Step 1: candlestick chart showing a sharp upward impulse of green candles">
            <line x1="24" y1="128" x2="336" y2="128" stroke="#11161d18" strokeWidth="1" />
            <CandleSeries candles={[...DEMAND_BASE, ...DEMAND_IMPULSE]} />
            <text x="24" y="22" fontSize="11" fill={mute} fontFamily="monospace">
              Sharp green run = buyers showed up
            </text>
            <path d="M128 70 L176 40" stroke={mark} strokeWidth="2.2" strokeLinecap="round" />
            <text x="180" y="38" fontSize="11" fill={mark} fontFamily="monospace" fontWeight="700">
              IMPULSE ↑
            </text>
          </Frame>
          <p className="mt-2 text-sm text-ink/65">{ZONE_STEPS[0].body}</p>
        </div>

        {/* Step 2 */}
        <div>
          <StepHeading n="2" title="Mark the base / origin" />
          <Frame viewBox="0 0 360 160" label="Step 2: candlestick chart with base consolidation marked before the impulse">
            <line x1="24" y1="136" x2="336" y2="136" stroke="#11161d18" strokeWidth="1" />
            <rect x="28" y="94" width="100" height="28" fill={softMark} stroke={mark} strokeWidth="1.5" />
            <CandleSeries candles={[...DEMAND_BASE, ...DEMAND_IMPULSE]} />
            <text x="24" y="22" fontSize="11" fill={mute} fontFamily="monospace">
              Origin of the move = the zone
            </text>
            <path d="M78 78 L78 94" stroke={mark} strokeWidth="1.5" />
            <text x="40" y="74" fontSize="10" fill={mark} fontFamily="monospace" fontWeight="700">
              BASE · mark this box
            </text>
          </Frame>
          <p className="mt-2 text-sm text-ink/65">{ZONE_STEPS[1].body}</p>
        </div>

        {/* Step 3 */}
        <div>
          <StepHeading n="3" title="Extend the zone" />
          <Frame viewBox="0 0 360 160" label="Step 3: demand zone band extended across candlestick chart">
            <line x1="24" y1="136" x2="336" y2="136" stroke="#11161d18" strokeWidth="1" />
            <rect
              x="28"
              y="94"
              width="292"
              height="28"
              fill={softMark}
              stroke={mark}
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
            <CandleSeries candles={[...DEMAND_BASE, ...DEMAND_IMPULSE, ...DEMAND_AFTER_EXTEND]} />
            <text x="24" y="22" fontSize="11" fill={mute} fontFamily="monospace">
              Stretch the band to the right
            </text>
            <text x="230" y="88" fontSize="10" fill={mark} fontFamily="monospace" fontWeight="700">
              DEMAND ZONE →
            </text>
          </Frame>
          <p className="mt-2 text-sm text-ink/65">{ZONE_STEPS[2].body}</p>
        </div>

        {/* Step 4 */}
        <div>
          <StepHeading n="4" title="Wait for the retest" />
          <Frame viewBox="0 0 360 170" label="Step 4: candlesticks pull back to retest the demand zone then bounce">
            <line x1="24" y1="146" x2="336" y2="146" stroke="#11161d18" strokeWidth="1" />
            <rect x="28" y="94" width="292" height="28" fill={softMark} stroke={mark} strokeWidth="1.5" />
            <CandleSeries
              candles={[...DEMAND_BASE, ...DEMAND_IMPULSE, ...DEMAND_PULLBACK_RETEST]}
            />
            <text x="24" y="22" fontSize="11" fill={mute} fontFamily="monospace">
              Price comes back — watch the reaction
            </text>
            <text x="36" y="88" fontSize="10" fill={mark} fontFamily="monospace" fontWeight="700">
              DEMAND
            </text>
            <text x="248" y="84" fontSize="11" fill={flare} fontFamily="monospace" fontWeight="700">
              RETEST
            </text>
            <path d="M276 88 L276 94" stroke={flare} strokeWidth="1.5" />
            <text x="288" y="52" fontSize="10" fill={mark} fontFamily="monospace">
              bounce?
            </text>
          </Frame>
          <p className="mt-2 text-sm text-ink/65">{ZONE_STEPS[3].body}</p>
        </div>
      </div>

      {/* Supply mirror note */}
      <div className="mt-8">
        <Caption>Supply zone · same steps, flipped</Caption>
        <Frame viewBox="0 0 360 160" label="Supply zone on candlesticks: impulse down from a base near the highs, then retest">
          <rect x="68" y="28" width="252" height="26" fill={softFlare} stroke={flare} strokeWidth="1.5" />
          <text x="78" y="45" fontSize="10" fill={flare} fontFamily="monospace" fontWeight="700">
            SUPPLY ZONE
          </text>
          <CandleSeries candles={SUPPLY_STORY} />
          <text x="248" y="72" fontSize="11" fill={flare} fontFamily="monospace">
            retest → drop?
          </text>
          <text x="24" y="148" fontSize="11" fill={mute} fontFamily="monospace">
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
  const asideCandles = [
    { x: 28, o: 118, h: 108, l: 128, c: 122 },
    { x: 44, o: 122, h: 112, l: 132, c: 116 },
    { x: 60, o: 116, h: 106, l: 126, c: 120 },
    { x: 76, o: 120, h: 110, l: 128, c: 114 },
    { x: 92, o: 114, h: 88, l: 120, c: 92 }, // leave demand
    { x: 108, o: 92, h: 68, l: 98, c: 72 },
    { x: 124, o: 72, h: 48, l: 80, c: 52 },
    { x: 140, o: 52, h: 36, l: 58, c: 40 },
    { x: 156, o: 40, h: 32, l: 50, c: 46 }, // base / supply origin
    { x: 172, o: 46, h: 34, l: 54, c: 38 },
    { x: 188, o: 38, h: 32, l: 58, c: 54 }, // leave supply
    { x: 204, o: 54, h: 48, l: 78, c: 74 },
    { x: 220, o: 74, h: 68, l: 98, c: 94 },
    { x: 236, o: 94, h: 88, l: 118, c: 112 }, // into demand
    { x: 252, o: 112, h: 90, l: 120, c: 96 }, // bounce
  ] as const;

  return (
    <div className="mt-8">
      <Caption>Chart sketch · zones</Caption>
      <svg
        viewBox="0 0 280 170"
        className="mt-3 w-full max-w-sm"
        role="img"
        aria-label="Candlestick chart with a demand zone bounce and a supply zone drop"
      >
        <rect width="280" height="170" fill={sheet} />
        <rect x="16" y="28" width="248" height="28" fill={softFlare} />
        <text x="24" y="46" fontSize="10" fill={flare} fontFamily="monospace">
          SUPPLY ZONE
        </text>
        <rect x="16" y="110" width="248" height="28" fill={softMark} />
        <text x="24" y="128" fontSize="10" fill={mark} fontFamily="monospace">
          DEMAND ZONE
        </text>
        <CandleSeries candles={asideCandles} w={8} />
        <text x="248" y="88" fontSize="10" fill={mark} fontFamily="monospace">
          bounce
        </text>
        <text x="196" y="24" fontSize="10" fill={flare} fontFamily="monospace">
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
