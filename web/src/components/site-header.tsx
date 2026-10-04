import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-[#f4f7fb] md:text-xl"
        >
          LJ CIRCLE
        </Link>
        <nav className="flex items-center gap-2 md:gap-3">
          <Link
            href="/learn"
            className="hidden px-3 py-2 text-sm font-medium text-[#f4f7fb]/75 transition-colors hover:text-[#f4f7fb] sm:inline"
          >
            Learn
          </Link>
          <Link
            href="/#xauusd"
            className="hidden px-3 py-2 text-sm font-medium text-[#f4f7fb]/75 transition-colors hover:text-[#f4f7fb] sm:inline"
          >
            XAUUSD
          </Link>
          <Link
            href="/watch/xauusd"
            className="hidden px-3 py-2 text-sm font-medium text-[#f4f7fb]/75 transition-colors hover:text-[#f4f7fb] md:inline"
          >
            Markets
          </Link>
          <Link
            href="#join"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-sm bg-[#c4a35a] px-4 text-ink hover:bg-[#e8d19a]",
            )}
          >
            Join Telegram
          </Link>
        </nav>
      </div>
    </header>
  );
}
