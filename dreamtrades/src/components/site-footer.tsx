import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-heading text-xl font-bold tracking-tight text-ink">
            {BRAND_NAME}
          </p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {BRAND_TAGLINE} Education only — not financial advice. Markets involve
            risk of loss.
          </p>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          Standalone teaching product · not LJ CIRCLE
        </p>
      </div>
    </footer>
  );
}
