import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroMarket } from "@/components/hero-market";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <HeroMarket />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-end px-5 pb-14 pt-28 md:px-8 md:pb-24 lg:pb-28">
        <div className="max-w-xl text-[#f4f7fb]">
          <p className="animate-rise font-heading text-5xl font-bold tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">
            LJ CIRCLE
          </p>
          <h1 className="animate-rise-delay mt-5 font-heading text-2xl font-semibold leading-[1.15] tracking-tight md:text-3xl">
            Gold moves. We stay in the circle.
          </h1>
          <p className="animate-rise-late mt-4 max-w-md text-base leading-relaxed text-[#f4f7fb]/78 md:text-lg">
            Live XAUUSD, TradingView charts, and a focused desk — built to catch
            your eye, then keep your attention where it pays.
          </p>
          <div className="animate-rise-late mt-8 flex flex-wrap gap-3">
            <Link
              href="#join"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-sm bg-[#c4a35a] px-5 text-ink hover:bg-[#e8d19a]",
              )}
            >
              Join the circle
            </Link>
            <Link
              href="#xauusd"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-sm border-[#f4f7fb]/35 bg-transparent px-5 text-[#f4f7fb] hover:bg-[#f4f7fb]/10 hover:text-[#f4f7fb]",
              )}
            >
              Watch XAUUSD live
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
