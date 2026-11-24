import { Droplets, FlaskConical, Gift, Truck } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";

const ICONS = [FlaskConical, Droplets, Gift, Truck];

export function SavoirFaireBanner() {
  return (
    <section
      aria-label="Les engagements de la Maison"
      className="border-b border-[#E5DFD5] bg-[#F2EDE6]/65"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid divide-y divide-[#E5DFD5] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {BRAND_CONFIG.savoirFaire.map((item, idx) => {
            const Icon = ICONS[idx] ?? FlaskConical;
            return (
              <div
                key={item.title}
                className="flex items-start gap-4 py-7 sm:px-6 first:sm:pl-0 last:sm:pr-0"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#E5DFD5] bg-[#FAF8F5] text-[#A68352]">
                  <Icon className="h-4 w-4 stroke-[1.5]" />
                </div>
                <div>
                  <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-[#161616]">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#6B655E]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
