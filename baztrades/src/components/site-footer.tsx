import Link from "next/link";
import { BRAND_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-heading text-base uppercase tracking-tight text-ink">{BRAND_NAME}</p>
          <p className="mt-1 text-sm text-ink/55">
            Teaching floor for Baz Trades. Education only — not financial advice.
          </p>
          <p className="mt-2 text-sm text-ink/50">
            Share the floor with the crew:{" "}
            <Link
              href="/learn"
              className="text-ink/70 underline decoration-ink/25 underline-offset-4 hover:text-ink"
            >
              /learn
            </Link>
          </p>
        </div>
        <div className="flex gap-5 text-sm text-ink/60">
          <Link href="/learn" className="hover:text-ink">
            The Floor
          </Link>
          <Link href="/#path" className="hover:text-ink">
            Why Baz
          </Link>
        </div>
      </div>
    </footer>
  );
}
