import { getAllPerfumes } from "@/lib/queries";
import { HeroSection } from "@/components/home/hero-section";
import { SavoirFaireBanner } from "@/components/home/savoir-faire-banner";
import { CollectionSection } from "@/components/home/collection-section";
import { StorytellingSection } from "@/components/home/storytelling-section";
import { OlfactoryQuizSection } from "@/components/home/olfactory-quiz";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const perfumes = await getAllPerfumes();

  return (
    <>
      <HeroSection />
      <SavoirFaireBanner />
      <CollectionSection perfumes={perfumes} />
      <StorytellingSection />
      <OlfactoryQuizSection perfumes={perfumes} />
    </>
  );
}
