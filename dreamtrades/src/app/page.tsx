import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { PathTeaser } from "@/components/path-teaser";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <main>
      <SiteHeader tone="dark" />
      <Hero />
      <PathTeaser />
      <SiteFooter />
    </main>
  );
}
