import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { PathOverview } from "@/components/path-overview";
import { MarketsLesson } from "@/components/lessons/markets-lesson";
import { LongShortLesson } from "@/components/lessons/long-short-lesson";
import { CandlesLesson } from "@/components/lessons/candles-lesson";
import { RiskLesson } from "@/components/lessons/risk-lesson";
import { ChecklistLesson } from "@/components/lessons/checklist-lesson";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <PathOverview />
      <MarketsLesson />
      <LongShortLesson />
      <CandlesLesson />
      <RiskLesson />
      <ChecklistLesson />
      <SiteFooter />
    </main>
  );
}
