import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/lib/site";

const links = [
  { href: "#path", label: "Path" },
  { href: "#markets", label: "Markets" },
  { href: "#long-short", label: "Long / Short" },
  { href: "#candles", label: "Candles" },
  { href: "#risk", label: "Risk" },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight text-ink md:text-xl"
        >
          {BRAND_NAME}
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden px-2.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:text-ink lg:inline"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#checklist"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-md bg-tide px-4 text-accent-foreground hover:bg-[#0b6a5c]",
            )}
          >
            Start path
          </Link>
        </nav>
      </div>
    </header>
  );
}
