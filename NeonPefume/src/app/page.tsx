import { getAllPerfumes } from "@/lib/catalog";
import { HeroSection } from "@/components/hero/HeroSection";
import { CraftsmanshipStrip } from "@/components/home/CraftsmanshipStrip";
import { CollectionSection } from "@/components/collection/CollectionSection";
import { StorytellingSection } from "@/components/home/StorytellingSection";
import { OlfactoryQuiz } from "@/components/quiz/OlfactoryQuiz";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const perfumes = await getAllPerfumes();

  return (
    <>
      <HeroSection perfumes={perfumes} />
      <CraftsmanshipStrip />
      <CollectionSection perfumes={perfumes} />
      <StorytellingSection />
      <OlfactoryQuiz perfumes={perfumes} />
    </>
  );
}
