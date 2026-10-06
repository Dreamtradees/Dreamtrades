import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PATH_PREVIEW } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

export function PathTeaser() {
  return (
    <section id="path" className="border-y border-ink/10 bg-[#ebe4d6]/55">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-mark">Why Baz Trades</p>
            <h2 className="mt-3 font-heading text-3xl uppercase tracking-tight text-ink md:text-4xl">
              Judgment over noise.
            </h2>
            <p className="mt-4 max-w-xl text-ink/65 md:text-lg">
              Most beginners chase calls. Baz trains the mechanics underneath —
              so you can read pressure, size risk, and decide without waiting on a tip.
            </p>
          </div>
          <Link
            href="/learn"
            data-testid="path-start-learning"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-sm bg-ink px-5 text-[#faf7f0] hover:bg-[#2a221c]",
            )}
          >
            Enter the floor
          </Link>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
          {PATH_PREVIEW.map((item) => (
            <div key={item.n} className="border-t-2 border-mark/70 pt-5">
              <p className="font-mono text-xs text-flare">{item.n}</p>
              <h3 className="mt-3 font-heading text-lg uppercase tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65 md:text-base">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
