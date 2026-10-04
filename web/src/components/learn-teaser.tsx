import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PREVIEW = [
  {
    n: "01",
    title: "Buy or sell",
    body: "A trade is a clear bet on direction — nothing mystical.",
  },
  {
    n: "02",
    title: "Long vs short",
    body: "Rise helps longs. Fall helps shorts. Same chart, opposite bets.",
  },
  {
    n: "03",
    title: "Risk before profit",
    body: "Stop loss, small size, never rent money. Then look at gold.",
  },
];

export function LearnTeaser() {
  return (
    <section
      id="learn"
      className="border-y border-ink/10 bg-[linear-gradient(180deg,#f7fafc_0%,#eef3f8_100%)]"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              New here?
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Learn the desk in six steps
            </h2>
            <p className="mt-3 text-ink/65 md:text-lg">
              Plain-English fundamentals for newbies and traders who want a
              clean reset — before the live XAUUSD chart pulls you in.
            </p>
          </div>
          <Link
            href="/learn"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-sm bg-ink px-5 text-[#f4f7fb] hover:bg-[#1e3a5f]",
            )}
          >
            Open Learn path
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {PREVIEW.map((item) => (
            <div key={item.n} className="border-t border-ink/15 pt-5">
              <p className="font-mono text-xs text-gold">{item.n}</p>
              <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65 md:text-base">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
