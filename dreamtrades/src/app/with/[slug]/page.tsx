import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AffiliateRefCapture } from "@/components/affiliate-ref-capture";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import {
  affiliateDisplayName,
  getAffiliate,
  normalizeAffiliateSlug,
} from "@/lib/affiliates";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/site";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = normalizeAffiliateSlug(raw);
  const name = slug ? affiliateDisplayName(slug) : "Partner";
  return {
    title: `${name} × ${BRAND_NAME}`,
    description: `${BRAND_TAGLINE} Start with ${name}.`,
  };
}

/**
 * Affiliate landing — she shares /with/her-slug
 * Captures ref, then sends people into /learn.
 */
export default async function AffiliateLandingPage({ params }: PageProps) {
  const { slug: raw } = await params;
  const slug = normalizeAffiliateSlug(raw);
  if (!slug) notFound();

  const affiliate = getAffiliate(slug);
  const name = affiliate?.name ?? slug;
  const blurb =
    affiliate?.blurb ??
    `Invited by ${name}. Learn trading fundamentals with ${BRAND_NAME} — then claim your seat when you graduate.`;
  const learnHref = `/learn?ref=${encodeURIComponent(slug)}`;

  return (
    <main className="min-h-screen">
      {/* Force store this landing slug even if URL has no ?ref= */}
      <AffiliateRefCapture />
      <script
        dangerouslySetInnerHTML={{
          __html: `try{sessionStorage.setItem("dreamtrades_affiliate_ref",${JSON.stringify(slug)})}catch(e){}`,
        }}
      />
      <SiteHeader tone="dark" />
      <section className="relative min-h-[100svh] overflow-hidden bg-ink text-[#f4f7f8]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(900px 520px at 20% -10%, rgba(15,159,138,0.35) 0%, transparent 55%), radial-gradient(700px 400px at 100% 20%, rgba(232,93,76,0.18) 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col justify-center px-5 pb-24 pt-28 md:px-8">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.22em] text-mark">
            Invited by {name}
          </p>
          <h1 className="animate-rise mt-5 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            {BRAND_NAME}
          </h1>
          <p className="animate-rise-delay mt-6 text-xl font-medium text-[#f4f7f8]/90 md:text-2xl">
            {BRAND_TAGLINE}
          </p>
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
              Start Learning
            </Link>
            <Link
              href={`/?ref=${encodeURIComponent(slug)}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-md border-[#f4f7f8]/30 bg-transparent px-6 text-[#f4f7f8] hover:bg-[#f4f7f8]/10 hover:text-[#f4f7f8]",
              )}
            >
              See DreamTrades
            </Link>
          </div>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-[#f4f7f8]/40">
            Partner code · {slug}
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
