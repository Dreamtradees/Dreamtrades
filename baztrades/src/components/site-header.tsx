import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = {
  tone?: "light" | "dark";
  active?: "home" | "learn";
};

export function SiteHeader({ tone = "light", active }: Props) {
  const dark = tone === "dark";
  const startHref = active === "learn" ? "#learn-path" : "/learn";

  return (
    <header
      className={cn(
        dark
          ? "absolute inset-x-0 top-0 z-20"
          : "relative z-20 border-b border-ink/10 bg-sheet/80 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className={cn(
            "font-heading text-base uppercase tracking-tight md:text-lg",
            dark ? "text-[#faf7f0]" : "text-ink",
          )}
        >
          {BRAND_NAME}
        </Link>
        <nav className="flex items-center gap-2 md:gap-3">
          <Link
            href="/learn"
            className={cn(
              "hidden px-3 py-2 text-sm font-medium transition-colors sm:inline",
              dark ? "text-[#faf7f0]/75 hover:text-[#faf7f0]" : "text-ink/65 hover:text-ink",
              active === "learn" && (dark ? "text-[#faf7f0]" : "text-ink"),
            )}
          >
            The Floor
          </Link>
          <Link
            href={active === "learn" ? "#live-gold" : "/#live-gold"}
            className={cn(
              "hidden px-3 py-2 text-sm font-medium transition-colors md:inline",
              dark ? "text-[#faf7f0]/75 hover:text-[#faf7f0]" : "text-ink/65 hover:text-ink",
            )}
          >
            Live gold
          </Link>
          <Link
            href="/#path"
            className={cn(
              "hidden px-3 py-2 text-sm font-medium transition-colors lg:inline",
              dark ? "text-[#faf7f0]/75 hover:text-[#faf7f0]" : "text-ink/65 hover:text-ink",
            )}
          >
            Why Baz
          </Link>
          <Link
            href={startHref}
            data-testid="start-learning"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-sm px-4",
              dark
                ? "bg-mark text-[#1a1408] hover:bg-[#dfb52f]"
                : "bg-ink text-[#faf7f0] hover:bg-[#2a221c]",
            )}
          >
            Enter the floor
          </Link>
        </nav>
      </div>
    </header>
  );
}
