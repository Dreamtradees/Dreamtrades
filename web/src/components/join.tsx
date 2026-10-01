import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JoinQr } from "@/components/join-qr";
import { TELEGRAM_GROUP_URL } from "@/lib/site";

export function Join() {
  return (
    <section
      id="join"
      className="relative overflow-hidden border-t border-ink/10 bg-ink text-[#f4f7fb]"
    >
      <div className="absolute -right-16 top-8 h-72 w-72 rounded-full border border-[#c4a35a]/25" />
      <div className="absolute -right-4 top-20 h-48 w-48 rounded-full border border-[#c4a35a]/40" />
      <div className="absolute -right-24 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,#c4a35a44,transparent_70%)] blur-2xl" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#c4a35a]">
              Join LJ CIRCLE
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-5xl">
              Scan in. Stay sharp.
            </h2>
            <p className="mt-4 text-[#f4f7fb]/72">
              Point your camera at the QR code to enter the LJ CIRCLE Telegram
              group — live gold focus, clean calls, no noise pile-on.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={TELEGRAM_GROUP_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-sm bg-[#c4a35a] px-5 text-ink hover:bg-[#e8d19a]",
                )}
              >
                Open Telegram group
              </Link>
              <Link
                href="#xauusd"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-sm border-[#f4f7fb]/30 bg-transparent px-5 text-[#f4f7fb] hover:bg-[#f4f7fb]/10 hover:text-[#f4f7fb]",
                )}
              >
                See live XAUUSD first
              </Link>
            </div>
          </div>

          <JoinQr />
        </div>
      </div>
    </section>
  );
}
