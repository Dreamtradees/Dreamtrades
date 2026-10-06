import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BRAND_TAGLINE } from "@/lib/site";
import { cn } from "@/lib/utils";

function FloorBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Deep floor */}
      <div className="absolute inset-0 bg-[#0c0a08]" />
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(201,162,39,0.28) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 15% 80%, rgba(225,29,72,0.12) 0%, transparent 50%), linear-gradient(160deg, #0c0a08 0%, #1a1510 45%, #0e0c09 100%)",
        }}
      />
      {/* Soft grid */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,162,39,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.35) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
        }}
      />
      {/* Animated candlesticks */}
      <svg
        className="absolute bottom-[18%] right-[-4%] h-[52%] w-[62%] opacity-70 md:right-[2%] md:w-[48%]"
        viewBox="0 0 640 320"
        fill="none"
      >
        <path
          className="baz-price-line"
          d="M20 240 C80 220 110 190 160 200 C210 210 240 140 290 130 C340 120 370 170 420 150 C470 130 510 90 560 70 C590 58 610 50 630 40"
          stroke="#c9a227"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {[
          [80, 160, 70],
          [140, 140, 90],
          [200, 120, 100],
          [260, 90, 80],
          [320, 100, 110],
          [380, 70, 95],
          [440, 55, 85],
          [500, 40, 75],
          [560, 30, 60],
        ].map(([x, top, h], i) => (
          <g key={x} className={i % 3 === 0 ? "baz-candle" : i % 3 === 1 ? "baz-candle-2" : "baz-candle-3"}>
            <line x1={x} y1={top - 18} x2={x} y2={top + h + 18} stroke="#c9a227" strokeWidth="1.5" opacity="0.55" />
            <rect
              x={x - 8}
              y={top}
              width="16"
              height={h}
              rx="2"
              fill={i % 2 === 0 ? "#c9a227" : "#e11d48"}
              opacity="0.75"
            />
          </g>
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(8,6,4,0.72)_0%,rgba(8,6,4,0.35)_42%,rgba(8,6,4,0.12)_70%,rgba(8,6,4,0.45)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(8,6,4,0.85),transparent)]" />
    </div>
  );
}

function LiveTicker() {
  const items = [
    "XAUUSD · learning mode",
    "Long = buy the rise",
    "Short = sell the fall",
    "Risk first · size the stop",
    "Supply presses · demand lifts",
    "Checklist before you click",
  ];
  const loop = [...items, ...items];
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 border-t border-[#c9a227]/25 bg-[#0c0a08]/75 backdrop-blur-sm">
      <div className="overflow-hidden py-3">
        <div className="baz-ticker flex w-max gap-10 whitespace-nowrap px-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#c9a227]/90">
          {loop.map((t, i) => (
            <span key={`${t}-${i}`} className="inline-flex items-center gap-10">
              <span>{t}</span>
              <span className="text-[#e11d48]/80">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#0c0a08] text-[#faf7f0]">
      <FloorBackdrop />
      <LiveTicker />
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-32 pt-28 md:px-8 md:pb-36 md:pt-32">
        <p className="animate-rise font-mono text-xs uppercase tracking-[0.28em] text-[#c9a227]">
          The Baz floor · fundamentals first
        </p>
        <p className="animate-rise mt-5 max-w-full font-heading text-[clamp(2.6rem,11vw,6.5rem)] uppercase leading-[0.92] tracking-tight">
          <span className="baz-gold-text">Baz</span>
          <br />
          Trades
        </p>
        <h1 className="animate-rise-delay mt-7 max-w-xl font-sans text-xl font-medium tracking-tight text-[#faf7f0]/92 sm:text-2xl md:text-3xl">
          {BRAND_TAGLINE}
        </h1>
        <p className="animate-rise-late mt-5 max-w-lg text-base leading-relaxed text-[#faf7f0]/62 md:text-lg">
          Seven hard lessons. One checklist. Leave the signal group mentality at the door —
          learn to read gold and decide for yourself.
        </p>
        <div className="animate-rise-late mt-10 flex flex-wrap gap-3">
          <Link
            href="/learn"
            data-testid="hero-start-learning"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-sm bg-mark px-7 text-[#1a1408] hover:bg-[#dfb52f]",
            )}
          >
            Enter the floor
          </Link>
          <Link
            href="/#path"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-sm border-[#faf7f0]/30 bg-transparent px-6 text-[#faf7f0] hover:bg-[#faf7f0]/10 hover:text-[#faf7f0]",
            )}
          >
            How Baz works
          </Link>
        </div>
      </div>
    </section>
  );
}
