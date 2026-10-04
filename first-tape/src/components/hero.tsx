import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(115deg, rgba(16,24,32,0.92) 0%, rgba(16,24,32,0.55) 38%, rgba(14,124,107,0.28) 100%), url(\"data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.08' stroke-width='1'%3E%3Cpath d='M0 40h160M0 80h160M0 120h160'/%3E%3Cpath d='M40 0v160M80 0v160M120 0v160'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "cover, 160px 160px",
        }}
      />
      <div
        aria-hidden
        className="glow-soft pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-tide/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[18%] overflow-hidden opacity-40"
      >
        <div className="tape-scroll flex w-[200%] gap-10 font-mono text-xs tracking-[0.28em] text-white/80 uppercase">
          <span>
            BUY · SELL · RISK · ENTRY · EXIT · SIZE · PLAN · REVIEW · BUY · SELL ·
            RISK · ENTRY · EXIT · SIZE · PLAN · REVIEW ·
          </span>
          <span>
            BUY · SELL · RISK · ENTRY · EXIT · SIZE · PLAN · REVIEW · BUY · SELL ·
            RISK · ENTRY · EXIT · SIZE · PLAN · REVIEW ·
          </span>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-end px-5 pb-14 pt-28 md:px-8 md:pb-24">
        <div className="max-w-2xl text-[#f2f7f8]">
          <p className="animate-rise font-heading text-5xl font-extrabold tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">
            {BRAND_NAME}
          </p>
          <h1 className="animate-rise-delay mt-5 font-heading text-2xl font-semibold leading-[1.15] tracking-tight md:text-3xl">
            Learn how to trade — not how to take signals.
          </h1>
          <p className="animate-rise-late mt-4 max-w-lg text-base leading-relaxed text-[#f2f7f8]/78 md:text-lg">
            {BRAND_TAGLINE} One simple path: markets, long vs short, candles,
            risk, then a checklist you can use on every decision.
          </p>
          <div className="animate-rise-late mt-8 flex flex-wrap gap-3">
            <Link
              href="#path"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-md bg-tide px-5 text-accent-foreground hover:bg-[#12a08b]",
              )}
            >
              Begin fundamentals
            </Link>
            <Link
              href="#checklist"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-md border-white/35 bg-transparent px-5 text-[#f2f7f8] hover:bg-white/10 hover:text-[#f2f7f8]",
              )}
            >
              Jump to checklist
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
