import Image from "next/image";
import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brand";
import { Button } from "@/components/ui/button";

export function StorytellingSection() {
  return (
    <section
      id="savoir-faire"
      className="scroll-mt-20 border-b border-[#E5DFD5] bg-[#F2EDE6]/55 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Asymmetric Editorial Dual Imagery */}
          <div className="grid grid-cols-12 items-end gap-5 lg:col-span-6">
            <div className="col-span-7 border border-[#E5DFD5] bg-[#FAF8F5] p-6 shadow-sm">
              <div className="relative aspect-[4/5] w-full bg-[#F2EDE6]">
                <Image
                  src="/images/perfumes/bois-altier.png"
                  alt="Bois Altier — Flacon en cristal et étiquette dorée"
                  fill
                  sizes="(max-width: 1024px) 55vw, 30vw"
                  className="object-contain p-4"
                />
              </div>
              <p className="mt-4 font-serif text-sm italic text-[#6B655E]">
                I. Bois Altier — Macération de cèdre Atlas &amp; oud blanc
              </p>
            </div>

            <div className="col-span-5 -translate-y-8 border border-[#E5DFD5] bg-[#FAF8F5] p-4 shadow-sm sm:p-5">
              <div className="relative aspect-[4/5] w-full bg-[#F2EDE6]">
                <Image
                  src="/images/perfumes/musc-ravageur.png"
                  alt="Musc Ravageur — Flacon velours carmin"
                  fill
                  sizes="(max-width: 1024px) 40vw, 22vw"
                  className="object-contain p-3"
                />
              </div>
              <p className="mt-3 font-serif text-xs italic text-[#6B655E]">
                II. Musc Ravageur — Cannelle &amp; ambre pur
              </p>
            </div>
          </div>

          {/* Editorial Narrative */}
          <div className="lg:col-span-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
              Manifeste d&apos;Atelier
            </p>
            <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.12] text-[#161616] sm:text-5xl">
              L&apos;Art du Sillage, entre rigueur minérale et matière vivante.
            </h2>

            <div className="mt-7 space-y-5 text-sm leading-relaxed text-[#6B655E] sm:text-base">
              <p>
                Née de la rencontre entre l&apos;héritage botanique de Grasse et une esthétique architecturale épurée, la Maison{" "}
                <strong className="font-medium text-[#161616]">
                  {BRAND_CONFIG.name}
                </strong>{" "}
                compose des extraits affranchis des tendances éphémères. Chaque formule est bâtie autour d&apos;une colonne vertébrale courte et lisible, laissant respirer la noblesse brute des récoltes.
              </p>
              <p>
                Du beurre d&apos;iris pallida affiné trois ans aux écorces de cannelle de Ceylan et au vétiver d&apos;Haïti distillé à la vapeur, nos jus reposent huit semaines en cuves inox avant d&apos;être filtrés à froid pour préserver toute l&apos;amplitude de leurs facettes de fond.
              </p>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-6 border-t border-[#E5DFD5] pt-8">
              <div>
                <h3 className="font-serif text-xl text-[#161616]">
                  Flaconnage Haute Densité
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#6B655E]">
                  Verre cristallin à fond massif dômé protégeant le jus des variations thermiques, surmonté d&apos;un capot laqué noir et or.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#161616]">
                  Sourcings Traçables
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#6B655E]">
                  Alcool de blé biologique français et essences sélectionnées directement auprès de producteurs partenaires.
                </p>
              </div>
            </div>

            <div className="mt-9">
              <Button asChild variant="outline">
                <Link href="/parfums/bois-altier">Explorer Bois Altier</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
