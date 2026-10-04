import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PATH_PREVIEW } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

export function PathTeaser() {
  return (
    <section id="path" className="border-y border-ink/10 bg-sheet/60">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mark">Why DreamTrades</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">Skills first. Signals later — if ever.</h2>
            <p className="mt-3 text-ink/65 md:text-lg">Most beginners chase calls. We teach the mechanics underneath so you can read a chart, size risk, and decide for yourself.</p>
          </div>
          <Link href="/learn" className={cn(buttonVariants({ size: "lg" }), "rounded-md bg-ink px-5 text-[#f4f7f8] hover:bg-[#1c2530]")}>Start the six lessons</Link>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {PATH_PREVIEW.map((item) => (
            <div key={item.n} className="border-t border-ink/15 pt-5">
              <p className="font-mono text-xs text-mark">{item.n}</p>
              <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65 md:text-base">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
