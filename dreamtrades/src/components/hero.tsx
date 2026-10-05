import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Official homepage hero photos from public @zhabii7_fx Instagram / Threads media. */
const HERO_PHOTOS = [
  {
    src: "/ig-test/06-porsche.jpg",
    alt: "Zhabii with a black Porsche — @zhabii7_fx",
    position: "object-[center_40%]",
  },
  {
    src: "/ig-test/03-post.jpg",
    alt: "Zhabii on a superbike — @zhabii7_fx",
    position: "object-[center_22%]",
  },
  {
    src: "/ig-test/07-spa-portrait.jpg",
    alt: "Zhabii — spa portrait @zhabii7_fx",
    position: "object-[center_28%]",
  },
  {
    src: "/ig-test/04-post.jpg",
    alt: "Trading desk charts — @zhabii7_fx",
    position: "object-[center_35%]",
  },
] as const;

function PhotoHeroBackdrop() {
  return (
    <>
      <div className="absolute inset-0" aria-hidden>
        {HERO_PHOTOS.map((photo, index) => (
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
      {/* Light readability plane only — keep photos visible, not muddy */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(8,12,16,0.55)_0%,rgba(8,12,16,0.28)_36%,rgba(8,12,16,0.08)_66%,rgba(8,12,16,0.22)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-[linear-gradient(to_top,rgba(8,12,16,0.45),transparent)]"
        aria-hidden
      />
      <span className="sr-only">
        Background photos from @zhabii7_fx on Instagram / Threads
      </span>
    </>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-[#f4f7f8]">
      <PhotoHeroBackdrop />
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-28 pt-28 md:px-8 md:pb-32 md:pt-32">
        <p className="animate-rise max-w-full font-heading text-[clamp(2rem,8.4vw,5.5rem)] font-extrabold tracking-tighter sm:text-6xl sm:tracking-tight md:text-7xl lg:text-8xl">
          {BRAND_NAME}
        </p>
        <h1 className="animate-rise-delay mt-6 max-w-2xl font-heading text-2xl font-semibold tracking-tight text-[#f4f7f8]/92 sm:text-3xl md:text-4xl">
          {BRAND_TAGLINE}
        </h1>
        <p className="animate-rise-late mt-5 max-w-xl text-base leading-relaxed text-[#f4f7f8]/68 md:text-lg">
          Seven plain-English lessons for newbies — including supply & demand.
          Build judgment before you risk a dollar — so you trade with a plan, not a tip feed.
        </p>
        <div className="animate-rise-late mt-10 flex flex-wrap gap-3">
          <Link
            href="/learn"
            data-testid="hero-start-learning"
            className={cn(buttonVariants({ size: "lg" }), "rounded-md bg-mark px-6 text-[#041512] hover:bg-[#14b8a0]")}
          >
            Start Learning
          </Link>
          <Link
            href="/#path"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-md border-[#f4f7f8]/30 bg-transparent px-6 text-[#f4f7f8] hover:bg-[#f4f7f8]/10 hover:text-[#f4f7f8]")}
          >
            See the path
          </Link>
        </div>
      </div>
    </section>
  );
}
