import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-[#f4f7f8]">
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-70" />
      <div className="pointer-events-none absolute -left-24 top-16 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,#0f9f8a55,transparent_68%)] blur-2xl attention-orb" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,#e85d4c33,transparent_70%)] blur-2xl" />
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] w-full opacity-80" viewBox="0 0 1440 420" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="tape" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f9f8a" stopOpacity="0.15" />
            <stop offset="55%" stopColor="#0f9f8a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e85d4c" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <path d="M0 280 C 180 250, 260 190, 420 210 C 600 235, 700 120, 860 140 C 1020 160, 1120 90, 1260 110 C 1340 120, 1400 150, 1440 160 L 1440 420 L 0 420 Z" fill="url(#tape)" opacity="0.22" />
        <path d="M0 270 C 180 240, 260 180, 420 200 C 600 225, 700 110, 860 130 C 1020 150, 1120 80, 1260 100 C 1340 110, 1400 140, 1440 150" fill="none" stroke="#0f9f8a" strokeWidth="2.5" className="chart-line" />
      </svg>
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-28 pt-28 md:px-8 md:pb-32 md:pt-32">
        <p className="animate-rise font-heading text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">{BRAND_NAME}</p>
        <h1 className="animate-rise-delay mt-6 max-w-2xl font-heading text-2xl font-semibold tracking-tight text-[#f4f7f8]/92 sm:text-3xl md:text-4xl">{BRAND_TAGLINE}</h1>
        <p className="animate-rise-late mt-5 max-w-xl text-base leading-relaxed text-[#f4f7f8]/68 md:text-lg">
          Seven plain-English lessons for newbies — including supply & demand.
          Build judgment before you risk a dollar — so you trade with a plan, not a tip feed.
        </p>
        <div className="animate-rise-late mt-10 flex flex-wrap gap-3">
          <Link href="/learn" className={cn(buttonVariants({ size: "lg" }), "rounded-md bg-mark px-6 text-[#041512] hover:bg-[#14b8a0]")}>Open the curriculum</Link>
          <Link href="/#path" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-md border-[#f4f7f8]/30 bg-transparent px-6 text-[#f4f7f8] hover:bg-[#f4f7f8]/10 hover:text-[#f4f7f8]")}>See the path</Link>
        </div>
      </div>
    </section>
  );
}
