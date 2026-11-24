import { Compass, Flower2, Gift, Truck } from "lucide-react";

const PILLARS = [
  {
    icon: Compass,
    title: "Composés à Grasse",
    subtitle: "Macération artisanale & haute concentration",
  },
  {
    icon: Flower2,
    title: "Matières premières naturelles",
    subtitle: "Absolues rares sourcées avec exigence",
  },
  {
    icon: Gift,
    title: "2 échantillons offerts",
    subtitle: "Découverte glissée dans chaque écrin",
  },
  {
    icon: Truck,
    title: "Livraison offerte dès 120 €",
    subtitle: "Expédition protégée & suivie sous 48h",
  },
] as const;

export function CraftsmanshipStrip() {
  return (
    <section
      aria-label="Engagements de la Maison"
      className="border-b border-[#E5DFD5] bg-[#F2EDE6]/65"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[#E5DFD5] px-6 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:px-10">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="flex items-start gap-4 py-7 sm:px-6 lg:first:pl-0 lg:last:pr-0"
            >
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-[#A68352]"
                strokeWidth={1.35}
              />
              <div>
                <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-[#161616]">
                  {pillar.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-[#6B655E]">
                  {pillar.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
