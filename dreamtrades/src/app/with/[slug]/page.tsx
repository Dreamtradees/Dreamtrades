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

const HOW_STEPS = [
  {
    n: "01",
    title: "Learn the language",
    body: "Seven plain-English stations — direction, pairs, candles, supply & demand, and risk — so charts stop feeling like noise.",
  },
  {
    n: "02",
    title: "Prove it on the checklist",
    body: "Before you risk a dollar, tick every box. Discipline first. Excitement last.",
  },
  {
    n: "03",
    title: "Claim your seat",
    body: "Graduate, leave your details, and join the room — Telegram, WhatsApp, and the crew that actually teaches.",
  },
] as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = normalizeAffiliateSlug(raw);
  const affiliate = slug ? getAffiliate(slug) : undefined;
  const name = affiliate?.name ?? (slug ? affiliateDisplayName(slug) : "Partner");
  return {
    title: `${name} — Stop chasing signals`,
    description:
      affiliate?.tagline ??
      `${name}: learn to trade with judgment — not tip spam.`,
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
  /** First lesson — never dump people on the checklist. */
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

      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link
            href={homeHref}
            className="font-heading text-lg font-bold tracking-tight text-[#f4f7f8] md:text-xl"
          >
            {name}
          </Link>
          <nav className="flex items-center gap-2 md:gap-3">
            <a
              href="#how"
              className="hidden px-3 py-2 text-sm font-medium text-[#f4f7f8]/75 transition-colors hover:text-[#f4f7f8] sm:inline"
            >
              How it works
            </a>
            <Link
              href={curriculumHref}
              className="hidden px-3 py-2 text-sm font-medium text-[#f4f7f8]/75 transition-colors hover:text-[#f4f7f8] md:inline"
              data-testid="nav-curriculum"
            >
              Curriculum
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
          </nav>
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
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.28em] text-mark">
            {eyebrow}
          </p>
          <p className="animate-rise mt-6 max-w-full font-heading text-[clamp(2.2rem,8.5vw,5.5rem)] font-extrabold leading-[0.95] tracking-tighter sm:tracking-tight">
            {name}
          </p>
          <h1 className="animate-rise-delay mt-7 max-w-2xl font-heading text-2xl font-semibold tracking-tight text-[#f4f7f8] sm:text-3xl md:text-[2.35rem] md:leading-tight">
            {tagline}
          </h1>
          <p className="animate-rise-late mt-5 max-w-lg text-base leading-relaxed text-[#f4f7f8]/68 md:text-lg">
            {blurb}
          </p>
          <div className="animate-rise-late mt-10 flex flex-wrap gap-3">
            <Link
              href={learnHref}
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-md bg-mark px-7 text-[#041512] hover:bg-[#14b8a0]",
              )}
              data-testid="affiliate-start-learning"
            >
              {ctaLabel}
            </Link>
            <a
              href="#how"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-md border-[#f4f7f8]/30 bg-transparent px-6 text-[#f4f7f8] hover:bg-[#f4f7f8]/10 hover:text-[#f4f7f8]",
              )}
              data-testid="see-how-it-works"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      <section
        id="how"
        className="scroll-mt-20 border-y border-ink/10 bg-[#ebe4d6]/40"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-mark">
            How it works
          </p>
          <h2 className="mt-3 max-w-xl font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Three steps. Then you&apos;re in the room.
          </h2>
          <p className="mt-4 max-w-lg text-ink/65 md:text-lg">
            No guesswork. A straight path from first lesson to your seat with {name}.
          </p>
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {HOW_STEPS.map((step) => (
              <div key={step.n} className="border-t-2 border-mark/70 pt-5">
                <p className="font-mono text-xs text-flare">{step.n}</p>
                <h3 className="mt-3 font-heading text-lg font-semibold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65 md:text-base">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href={learnHref}
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-md bg-ink px-7 text-[#f4f7f8] hover:bg-[#1c2530]",
              )}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-sheet">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-heading text-lg font-bold tracking-tight text-ink">{name}</p>
            <p className="mt-1 text-sm text-ink/55">{footerNote}</p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-ink/60">
            <a href="#how" className="hover:text-ink">
              How it works
            </a>
            <Link href={curriculumHref} className="hover:text-ink">
              Curriculum
            </Link>
            <Link href={learnHref} className="font-medium text-mark hover:underline">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
