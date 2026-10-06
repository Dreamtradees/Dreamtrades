"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguagePicker } from "@/components/language-picker";
import { useLocale } from "@/components/locale-provider";
import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_LOCALE, getAffiliateCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Public @sarah.aboutaleb Instagram photos — professional, covered-up only. */
const SARA_HERO_PHOTOS = [
  {
    src: "/sara/05-blazer-portrait.jpg",
    alt: "Sarah Aboutaleb in a black blazer — @sarah.aboutaleb",
    position: "object-[center_18%]",
  },
  {
    src: "/sara/06-blazer-stairs.jpg",
    alt: "Sarah Aboutaleb on a marble staircase in a black blazer — @sarah.aboutaleb",
    position: "object-[center_22%]",
  },
  {
    src: "/sara/07-denim-portrait.jpg",
    alt: "Sarah Aboutaleb in a pearl denim set — @sarah.aboutaleb",
    position: "object-[center_20%]",
  },
  {
    src: "/sara/08-denim-lookback.jpg",
    alt: "Sarah Aboutaleb look-back in pearl denim — @sarah.aboutaleb",
    position: "object-[center_24%]",
  },
] as const;

type Props = {
  slug: string;
  name: string;
  learnHref: string;
  curriculumHref: string;
  homeHref: string;
  /** English fallbacks from affiliates.ts when no dict entry */
  fallback: {
    eyebrow: string;
    tagline: string;
    blurb: string;
    ctaLabel: string;
    footerNote: string;
  };
};

function withLang(href: string, locale: string): string {
  if (locale === DEFAULT_LOCALE) return href;
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const base = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}lang=${locale}${hash}`;
}

function SaraPhotoHeroBackdrop() {
  return (
    <>
      <div className="absolute inset-0" aria-hidden>
        {SARA_HERO_PHOTOS.map((photo, index) => (
          <div
            key={photo.src}
            className={cn("absolute inset-0 ig-hero-slide", `ig-hero-slide-${index + 1}`)}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              quality={92}
              className={cn("object-cover", photo.position)}
            />
          </div>
        ))}
      </div>
      {/* Dark/teal readability plane — photos stay visible, brand text readable */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(8,12,16,0.72)_0%,rgba(8,18,20,0.48)_38%,rgba(8,16,18,0.22)_68%,rgba(8,12,16,0.42)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_420px_at_18%_-6%,rgba(15,159,138,0.28)_0%,transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(8,12,16,0.55),transparent)]"
        aria-hidden
      />
      <span className="sr-only">
        Background photos from @sarah.aboutaleb on Instagram
      </span>
    </>
  );
}

export function AffiliateLandingContent({
  slug,
  name,
  learnHref: learnHrefBase,
  curriculumHref: curriculumHrefBase,
  homeHref: homeHrefBase,
  fallback,
}: Props) {
  const { locale, messages } = useLocale();
  const copy = getAffiliateCopy(locale, slug, fallback);
  const { landing } = messages;
  const learnHref = withLang(learnHrefBase, locale);
  const curriculumHref = withLang(curriculumHrefBase, locale);
  const homeHref = withLang(homeHrefBase, locale);
  const showSaraPhotos = slug === "sara";

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5 md:px-8">
          <Link
            href={homeHref}
            className="font-heading text-lg font-bold tracking-tight text-[#f4f7f8] md:text-xl"
          >
            {name}
          </Link>
          <nav className="flex items-center gap-1.5 md:gap-3">
            <LanguagePicker tone="dark" className="me-1" />
            <a
              href="#how"
              className="hidden px-3 py-2 text-sm font-medium text-[#f4f7f8]/75 transition-colors hover:text-[#f4f7f8] sm:inline"
            >
              {landing.navHow}
            </a>
            <Link
              href={curriculumHref}
              className="hidden px-3 py-2 text-sm font-medium text-[#f4f7f8]/75 transition-colors hover:text-[#f4f7f8] md:inline"
              data-testid="nav-curriculum"
            >
              {landing.navCurriculum}
            </Link>
            <Link
              href={learnHref}
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-md bg-mark px-4 text-[#041512] hover:bg-[#14b8a0]",
              )}
              data-testid="start-learning"
            >
              {copy.ctaLabel}
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative min-h-[100svh] overflow-hidden bg-ink text-[#f4f7f8]">
        {showSaraPhotos ? (
          <SaraPhotoHeroBackdrop />
        ) : (
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(900px 520px at 18% -8%, rgba(15,159,138,0.38) 0%, transparent 55%), radial-gradient(720px 420px at 95% 15%, rgba(232,93,76,0.2) 0%, transparent 50%), linear-gradient(165deg, #11161d 0%, #0c1016 55%, #151c24 100%)",
            }}
          />
        )}
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-24 pt-28 md:px-8 md:pb-28 md:pt-32">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.28em] text-mark">
            {copy.eyebrow}
          </p>
          <p className="animate-rise mt-6 max-w-full font-heading text-[clamp(2.2rem,8.5vw,5.5rem)] font-extrabold leading-[0.95] tracking-tighter sm:tracking-tight">
            {name}
          </p>
          <h1 className="animate-rise-delay mt-7 max-w-2xl font-heading text-2xl font-semibold tracking-tight text-[#f4f7f8] sm:text-3xl md:text-[2.35rem] md:leading-tight">
            {copy.tagline}
          </h1>
          <p className="animate-rise-late mt-5 max-w-lg text-base leading-relaxed text-[#f4f7f8]/68 md:text-lg">
            {copy.blurb}
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
              {copy.ctaLabel}
            </Link>
            <a
              href="#how"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-md border-[#f4f7f8]/30 bg-transparent px-6 text-[#f4f7f8] hover:bg-[#f4f7f8]/10 hover:text-[#f4f7f8]",
              )}
              data-testid="see-how-it-works"
            >
              {landing.seeHow}
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
            {landing.howEyebrow}
          </p>
          <h2 className="mt-3 max-w-xl font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {landing.howTitle}
          </h2>
          <p className="mt-4 max-w-lg text-ink/65 md:text-lg">{landing.howLead(name)}</p>
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {landing.howSteps.map((step) => (
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
              {copy.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-sheet">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-heading text-lg font-bold tracking-tight text-ink">{name}</p>
            <p className="mt-1 text-sm text-ink/55">{copy.footerNote}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm text-ink/60">
            <LanguagePicker tone="light" />
            <a href="#how" className="hover:text-ink">
              {landing.navHow}
            </a>
            <Link href={curriculumHref} className="hover:text-ink">
              {landing.navCurriculum}
            </Link>
            <Link href={learnHref} className="font-medium text-mark hover:underline">
              {copy.ctaLabel}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
