import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Join() {
  return (
    <section
      id="join"
      className="relative overflow-hidden border-t border-ink/10 bg-ink text-[#f4efe4]"
    >
      <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,#c47a2c55,transparent_70%)] blur-2xl" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-5 py-20 md:flex-row md:items-end md:justify-between md:px-8 md:py-28">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#e8c089]">
            Join DreamTrades
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-5xl">
            Bring your focus. We&apos;ll bring the desk.
          </h2>
          <p className="mt-4 text-[#f4efe4]/72">
            Get session notes, attentive watchlists, and a calmer way to trade —
            built for people who want clarity more than noise.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="https://t.me/DreamtradeesBot"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-sm bg-[#f4efe4] px-5 text-ink hover:bg-[#e8c089]",
            )}
          >
            Message the bot
          </Link>
          <Link
            href="/watch"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-sm border-[#f4efe4]/30 bg-transparent px-5 text-[#f4efe4] hover:bg-[#f4efe4]/10 hover:text-[#f4efe4]",
            )}
          >
            Preview the desk
          </Link>
        </div>
      </div>
    </section>
  );
}
