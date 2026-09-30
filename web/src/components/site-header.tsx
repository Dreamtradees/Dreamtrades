import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-[#f4efe4] md:text-xl"
        >
          DreamTrades
        </Link>
        <nav className="flex items-center gap-2 md:gap-3">
          <Link
            href="/watch/xauusd"
            className="hidden px-3 py-2 text-sm font-medium text-[#f4efe4]/75 transition-colors hover:text-[#f4efe4] sm:inline"
          >
            Markets
          </Link>
          <Link
            href="/watch"
            className="hidden px-3 py-2 text-sm font-medium text-[#f4efe4]/75 transition-colors hover:text-[#f4efe4] md:inline"
          >
            Watch desk
          </Link>
          <Link
            href="#join"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-sm bg-[#f4efe4] px-4 text-ink hover:bg-[#e8c089]",
            )}
          >
            Join the desk
          </Link>
        </nav>
      </div>
    </header>
  );
}
