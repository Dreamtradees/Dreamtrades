import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { AttentionBoard } from "@/components/attention-board";
import { SiteFooter } from "@/components/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function WatchPage() {
  return (
    <main className="min-h-screen">
      <div className="relative bg-ink pb-8 pt-0">
        <SiteHeader />
        <div className="h-20" />
      </div>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-tide">
            Watch desk
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            DreamTrades attention board
          </h1>
          <p className="mt-4 text-ink/65">
            A quieter desk for the instruments that deserve your eyes. Focus one
            market at a time — notes update with your attention.
          </p>
          <div className="mt-6">
            <Link
              href="/#join"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-sm bg-ink px-5 text-primary-foreground hover:bg-tide",
              )}
            >
              Join the live desk
            </Link>
          </div>
        </div>

        <div className="mt-14">
          <AttentionBoard />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
