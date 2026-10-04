import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { PathTeaser } from "@/components/path-teaser";
import { LiveGoldDesk } from "@/components/live-gold-desk";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <main>
      <SiteHeader tone="dark" />
      <Hero />
      <PathTeaser />
      <LiveGoldDesk variant="overview" showLearnCta />
      <SiteFooter />
    </main>
  );
}
