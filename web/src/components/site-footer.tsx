import Link from "next/link";
import { TELEGRAM_GROUP_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-ink/55 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-heading text-base font-semibold text-ink">LJ CIRCLE</p>
        <p>Attentive trading. Not financial advice.</p>
        <div className="flex gap-4">
          <Link href="#xauusd" className="hover:text-ink">
            XAUUSD
          </Link>
          <Link href="/watch/xauusd" className="hover:text-ink">
            Markets
          </Link>
          <Link
            href={TELEGRAM_GROUP_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            Telegram
          </Link>
        </div>
      </div>
    </footer>
  );
}
