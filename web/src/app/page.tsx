import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Ticker } from "@/components/ticker";
import { AttentionBoard } from "@/components/attention-board";
import { XauusdDesk } from "@/components/xauusd-desk";
import { XauusdScalpSignals } from "@/components/xauusd-scalp-signals";
import { Practice } from "@/components/practice";
import { Join } from "@/components/join";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <Ticker />
      <XauusdDesk />
      <XauusdScalpSignals />
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <AttentionBoard />
      </section>
      <Practice />
      <Join />
      <SiteFooter />
    </main>
  );
}
