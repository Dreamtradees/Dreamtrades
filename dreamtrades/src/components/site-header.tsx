import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <header className={cn(dark ? "absolute inset-x-0 top-0 z-20" : "relative")}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className={cn("font-heading text-lg font-bold tracking-tight md:text-xl", dark ? "text-[#f4f7f8]" : "text-ink")}>
          {BRAND_NAME}
        </Link>
        <nav className="flex items-center gap-2 md:gap-3">
          <Link href="/learn" className={cn("hidden px-3 py-2 text-sm font-medium transition-colors sm:inline", dark ? "text-[#f4f7f8]/75 hover:text-[#f4f7f8]" : "text-ink/65 hover:text-ink")}>
            Curriculum
          </Link>
          <Link href="/#path" className={cn("hidden px-3 py-2 text-sm font-medium transition-colors md:inline", dark ? "text-[#f4f7f8]/75 hover:text-[#f4f7f8]" : "text-ink/65 hover:text-ink")}>
            Why this
          </Link>
          <Link href="/learn" className={cn(buttonVariants({ size: "lg" }), "rounded-md px-4", dark ? "bg-mark text-[#041512] hover:bg-[#14b8a0]" : "bg-ink text-[#f4f7f8] hover:bg-[#1c2530]")}>
            Start learning
          </Link>
        </nav>
      </div>
    </header>
  );
}
