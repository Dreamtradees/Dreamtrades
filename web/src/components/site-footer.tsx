import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-ink/55 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-heading text-base font-semibold text-ink">DreamTrades</p>
        <p>Attentive trading. Not financial advice.</p>
        <div className="flex gap-4">
          <Link href="/watch" className="hover:text-ink">
            Watch desk
          </Link>
          <Link href="#join" className="hover:text-ink">
            Join
          </Link>
        </div>
      </div>
    </footer>
  );
}
