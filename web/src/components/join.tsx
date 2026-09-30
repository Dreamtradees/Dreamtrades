import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JoinQr } from "@/components/join-qr";
import { TELEGRAM_BOT_URL, TELEGRAM_GROUP_URL } from "@/lib/site";

export function Join() {
  return (
    <section
      id="join"
      className="relative overflow-hidden border-t border-ink/10 bg-ink text-[#f4efe4]"
    >
      <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,#c47a2c55,transparent_70%)] blur-2xl" />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#e8c089]">
              Join the desk
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-5xl">
              Bring your focus. We&apos;ll bring the desk.
            </h2>
            <p className="mt-4 text-[#f4efe4]/72">
              Scan the code to enter the DreamTrades Telegram group, or open the
              watch desk preview first.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={TELEGRAM_GROUP_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-sm bg-[#f4efe4] px-5 text-ink hover:bg-[#e8c089]",
                )}
              >
                Open Telegram group
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
              <Link
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "rounded-sm px-5 text-[#f4efe4]/80 hover:bg-[#f4efe4]/10 hover:text-[#f4efe4]",
                )}
              >
                Message the bot
              </Link>
            </div>
          </div>

          <JoinQr />
        </div>
      </div>
    </section>
  );
}
