import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AffiliateRefCapture } from "@/components/affiliate-ref-capture";
import { buttonVariants } from "@/components/ui/button";
import {
  affiliateDisplayName,
  getAffiliate,
  normalizeAffiliateSlug,
} from "@/lib/affiliates";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = normalizeAffiliateSlug(raw);
  const affiliate = slug ? getAffiliate(slug) : undefined;
  const name = affiliate?.name ?? (slug ? affiliateDisplayName(slug) : "Partner");
  return {
    title: `${name} — Learn how to trade`,
    description:
      affiliate?.blurb ??
      `${name}: fundamentals first, then join the crew when you graduate.`,
  };
}

/**
 * Face-brand affiliate landing — her name is hero-level; DreamTrades stays invisible.
 */
export default async function AffiliateLandingPage({ params }: PageProps) {
  const { slug: raw } = await params;
  const slug = normalizeAffiliateSlug(raw);
  if (!slug) notFound();

  const affiliate = getAffiliate(slug);
  const name = affiliate?.name ?? slug.toUpperCase();
  const eyebrow = affiliate?.eyebrow ?? `${name} · trading group`;
  const tagline =
    affiliate?.tagline ?? "Learn how to trade — not how to take signals.";
  const blurb =
    affiliate?.blurb ??
    `Seven plain-English lessons with ${name}. Checklist, then your seat with the crew.`;
  const ctaLabel = affiliate?.ctaLabel ?? "Start Learning";
  const footerNote =
    affiliate?.footerNote ?? `Education for ${name}. Not financial advice.`;
  const learnHref = `/learn?ref=${encodeURIComponent(slug)}`;
  const homeHref = `/with/${encodeURIComponent(slug)}`;

  return (
    <main className="min-h-screen">
      <AffiliateRefCapture />
      <script
        dangerouslySetInnerHTML={{
          __html: `try{sessionStorage.setItem("dreamtrades_affiliate_ref",${JSON.stringify(slug)})}catch(e){}`,
        }}
      />

      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link
            href={homeHref}
            className="font-heading text-lg font-bold tracking-tight text-[#f4f7f8] md:text-xl"
          >
            {name}
          </Link>
          <Link
            href={learnHref}
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-md bg-mark px-4 text-[#041512] hover:bg-[#14b8a0]",
            )}
            data-testid="start-learning"
          >
            {ctaLabel}
          </Link>
        </div>
      </header>

      <section className="relative min-h-[100svh] overflow-hidden bg-ink text-[#f4f7f8]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(900px 520px at 18% -8%, rgba(15,159,138,0.38) 0%, transparent 55%), radial-gradient(720px 420px at 95% 15%, rgba(232,93,76,0.2) 0%, transparent 50%), linear-gradient(165deg, #11161d 0%, #0c1016 55%, #151c24 100%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-24 pt-28 md:px-8 md:pb-28 md:pt-32">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.22em] text-mark">
            {eyebrow}
          </p>
          <p className="animate-rise mt-5 max-w-full font-heading text-[clamp(2.1rem,8vw,5.25rem)] font-extrabold tracking-tighter sm:tracking-tight">
            {name}
          </p>
          <h1 className="animate-rise-delay mt-6 max-w-2xl font-heading text-2xl font-semibold tracking-tight text-[#f4f7f8]/92 sm:text-3xl md:text-4xl">
            {tagline}
          </h1>
          <p className="animate-rise-late mt-5 max-w-xl text-base leading-relaxed text-[#f4f7f8]/65 md:text-lg">
            {blurb}
          </p>
          <div className="animate-rise-late mt-10 flex flex-wrap gap-3">
            <Link
              href={learnHref}
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-md bg-mark px-6 text-[#041512] hover:bg-[#14b8a0]",
              )}
              data-testid="affiliate-start-learning"
            >
              {ctaLabel}
            </Link>
            <Link
              href={`${learnHref}#checklist`}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-md border-[#f4f7f8]/30 bg-transparent px-6 text-[#f4f7f8] hover:bg-[#f4f7f8]/10 hover:text-[#f4f7f8]",
              )}
            >
              See the path
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-sheet">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-heading text-lg font-bold tracking-tight text-ink">{name}</p>
            <p className="mt-1 text-sm text-ink/55">{footerNote}</p>
          </div>
          <Link
            href={learnHref}
            className="text-sm font-medium text-ink/65 hover:text-ink"
          >
            Curriculum
          </Link>
        </div>
      </footer>
    </main>
  );
}
