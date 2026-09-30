import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroMarket } from "@/components/hero-market";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <HeroMarket />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-end px-5 pb-14 pt-28 md:px-8 md:pb-24 lg:pb-28">
        <div className="max-w-xl text-[#f4efe4]">
          <p className="animate-rise font-heading text-5xl font-bold tracking-[-0.045em] sm:text-6xl md:text-7xl">
            DreamTrades
          </p>
          <h1 className="animate-rise-delay mt-5 font-heading text-2xl font-semibold leading-[1.15] tracking-tight md:text-3xl">
            Trading for people who actually pay attention.
          </h1>
          <p className="animate-rise-late mt-4 max-w-md text-base leading-relaxed text-[#f4efe4]/78 md:text-lg">
            We cut the noise, watch the levels that matter, and keep you close to
            the tape — calmly, carefully, every session.
          </p>
          <div className="animate-rise-late mt-8 flex flex-wrap gap-3">
            <Link
              href="#join"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-sm bg-[#f4efe4] px-5 text-ink hover:bg-[#e8c089]",
              )}
            >
              Start watching with us
            </Link>
            <Link
              href="/watch"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-sm border-[#f4efe4]/35 bg-transparent px-5 text-[#f4efe4] hover:bg-[#f4efe4]/10 hover:text-[#f4efe4]",
              )}
            >
              Open the watch desk
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
