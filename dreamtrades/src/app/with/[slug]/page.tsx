import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AffiliateLandingContent } from "@/components/affiliate-landing-content";
import { AffiliateRefCapture } from "@/components/affiliate-ref-capture";
import { LocaleProvider } from "@/components/locale-provider";
import {
  affiliateDisplayName,
  getAffiliate,
  normalizeAffiliateSlug,
} from "@/lib/affiliates";
import { getAffiliateCopy, getMessages, normalizeLocale, type Locale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug: raw } = await params;
  const sp = await searchParams;
  const slug = normalizeAffiliateSlug(raw);
  const locale: Locale = normalizeLocale(sp.lang) ?? "en";
  const affiliate = slug ? getAffiliate(slug) : undefined;
  const name = affiliate?.name ?? (slug ? affiliateDisplayName(slug) : "Partner");
  const copy = getAffiliateCopy(locale, slug || "", {
    eyebrow: affiliate?.eyebrow,
    tagline: affiliate?.tagline,
    blurb: affiliate?.blurb,
    ctaLabel: affiliate?.ctaLabel,
    footerNote: affiliate?.footerNote,
  });
  const m = getMessages(locale);
  return {
    title: `${name} — ${m.landing.metaTitleSuffix}`,
    description: copy.tagline || `${name}: ${m.landing.metaDescriptionFallback}`,
  };
}

/**
 * Face-brand affiliate landing — her name is hero-level; DreamTrades stays invisible.
 */
export default async function AffiliateLandingPage({ params, searchParams }: PageProps) {
  const { slug: raw } = await params;
  const sp = await searchParams;
  const slug = normalizeAffiliateSlug(raw);
  if (!slug) notFound();

  const initialLocale = normalizeLocale(sp.lang) ?? undefined;
  const affiliate = getAffiliate(slug);
  const name = affiliate?.name ?? slug.toUpperCase();
  const learnHref = `/learn?ref=${encodeURIComponent(slug)}#trade`;
  const curriculumHref = `/learn?ref=${encodeURIComponent(slug)}#learn-path`;
  const homeHref = `/with/${encodeURIComponent(slug)}`;

  return (
    <main className="min-h-screen">
      <AffiliateRefCapture />
      <script
        dangerouslySetInnerHTML={{
          __html: `try{sessionStorage.setItem("dreamtrades_affiliate_ref",${JSON.stringify(slug)})}catch(e){}`,
        }}
      />
      <LocaleProvider initialLocale={initialLocale}>
        <AffiliateLandingContent
          slug={slug}
          name={name}
          learnHref={learnHref}
          curriculumHref={curriculumHref}
          homeHref={homeHref}
          fallback={{
            eyebrow: affiliate?.eyebrow ?? `${name} · trading group`,
            tagline: affiliate?.tagline ?? "Learn how to trade — not how to take signals.",
            blurb:
              affiliate?.blurb ??
              `Seven plain-English lessons with ${name}. Checklist, then your seat with the crew.`,
            ctaLabel: affiliate?.ctaLabel ?? "Start Learning",
            footerNote: affiliate?.footerNote ?? `Education for ${name}. Not financial advice.`,
          }}
        />
      </LocaleProvider>
    </main>
  );
}
