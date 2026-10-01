import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Ticker } from "@/components/ticker";
import { MarketDesk } from "@/components/market-desk";
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
      <MarketDesk chartVariant="full" chartHeight={500} />
      <XauusdScalpSignals />
      <Practice />
      <Join />
      <SiteFooter />
    </main>
  );
}
