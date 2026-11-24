"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowDownRight, Eye, RotateCw, Sparkles } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import type { PerfumeWithVariants } from "@/types/perfume";
import type { HeroCameraMode } from "@/components/hero/PerfumeBottleCanvas";

const PerfumeBottleCanvas = dynamic(
  () => import("@/components/hero/PerfumeBottleCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <div className="h-14 w-14 rounded-full border border-[#E5DFD5] border-t-[#A68352] animate-spin" />
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#6B655E]">
          Mise en lumière du flacon
        </span>
      </div>
    ),
  }
);

interface HeroSectionProps {
  perfumes: PerfumeWithVariants[];
}

export function HeroSection({ perfumes }: HeroSectionProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    perfumes[0]?.slug ?? "aventus"
  );
  const [cameraMode, setCameraMode] = useState<HeroCameraMode>("studio");

  const activePerfume =
    perfumes.find((p) => p.slug === selectedSlug) ?? perfumes[0];

  const lowestPrice = activePerfume?.variants[0]?.priceCents ?? 11500;

  return (
    <section
      id="hero"
      className="relative min-h-[94vh] w-full overflow-hidden border-b border-[#E5DFD5] bg-[#FAF8F5] pt-24 pb-12 lg:pt-28 lg:pb-16"
    >
      {/* Subtil halo lumineux alabaster derrière la scène 3D */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8%] top-[10%] h-[580px] w-[580px] rounded-full opacity-45 blur-3xl transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, ${activePerfume?.accentHex ?? "#A68352"}1F 0%, rgba(242,237,230,0.45) 45%, transparent 72%)`,
        }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        {/* Colonne éditoriale gauche */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 flex flex-col items-start lg:order-1 lg:col-span-6"
        >
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-[#A68352]">
            {BRAND_CONFIG.name} · {BRAND_CONFIG.atelierLocation}
          </p>

          <h1 className="font-serif text-5xl font-light leading-[1.03] tracking-[-0.015em] text-[#161616] sm:text-6xl xl:text-[4.6rem]">
            L&apos;architecture
            <br />
            du <span className="italic font-normal text-[#A68352]">sillage</span>
            <br />
            contemporain.
          </h1>

          <p className="mt-7 max-w-lg text-sm leading-relaxed text-[#6B655E] sm:text-base">
            Six créations en concentration Parfum Intense, macérées lentement à
            Grasse à partir d&apos;essences nobles et habillées d&apos;un cristal
            lourd à médaillon doré.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <a href="#collection">
                Découvrir la Collection
                <ArrowDownRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#diagnostic">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                Trouver votre signature
              </a>
            </Button>
          </div>

          {/* Fiche rapide du flacon actuellement observé en 3D */}
          {activePerfume && (
            <div className="mt-12 w-full max-w-lg border-t border-[#E5DFD5] pt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#6B655E]">
                    Flacon en scène · {activePerfume.olfactoryFamily}
                  </span>
                  <h2 className="mt-1 font-serif text-2xl font-normal text-[#161616]">
                    {activePerfume.name}
                  </h2>
                  <p className="mt-0.5 text-xs text-[#6B655E]">
                    {activePerfume.topNotes.slice(0, 3).join(" · ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6B655E]">À partir de</p>
                  <p className="font-serif text-xl text-[#161616]">
                    {formatPrice(lowestPrice)}
                  </p>
                  <Link
                    href={`/parfums/${activePerfume.slug}`}
                    className="mt-1 inline-block text-[11px] uppercase tracking-[0.18em] text-[#A68352] underline-offset-4 hover:underline"
                  >
                    Voir le parfum
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Colonne Scène 3D interactive droite */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 flex flex-col lg:order-2 lg:col-span-6"
        >
          <div className="relative h-[430px] w-full sm:h-[520px] lg:h-[600px]">
            {activePerfume && (
              <PerfumeBottleCanvas
                bottle={{
                  slug: activePerfume.slug,
                  name: activePerfume.name,
                  labelStyle: activePerfume.labelStyle,
                  accentHex: activePerfume.accentHex,
                }}
                fallbackImageUrl={activePerfume.imageUrl}
                cameraMode={cameraMode}
              />
            )}

            {/* Indicateur discret d'interaction & bascule vue Détail */}
            <div className="pointer-events-none absolute inset-x-0 top-2 flex items-center justify-between px-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#6B655E]/85">
                <RotateCw className="h-3 w-3 text-[#A68352]" strokeWidth={1.5} />
                Faire pivoter le flacon
              </span>

              <button
                type="button"
                onClick={() =>
                  setCameraMode((prev) =>
                    prev === "studio" ? "detail" : "studio"
                  )
                }
                className="pointer-events-auto inline-flex items-center gap-1.5 border border-[#E5DFD5] bg-[#FAF8F5]/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#161616] backdrop-blur-sm transition-colors hover:border-[#A68352] hover:text-[#A68352] cursor-pointer"
              >
                <Eye className="h-3 w-3" strokeWidth={1.5} />
                {cameraMode === "studio" ? "Vue Détail" : "Vue Studio"}
              </button>
            </div>
          </div>

          {/* Sélecteur discret des finitions / médaillons de la collection */}
          <div className="mt-2 flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#6B655E]">
              Explorer les médaillons de la Maison
            </span>
            <div
              role="radiogroup"
              aria-label="Choisir le parfum affiché en 3D"
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {perfumes.map((perfume) => {
                const isSelected = perfume.slug === activePerfume?.slug;
                return (
                  <button
                    key={perfume.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedSlug(perfume.slug)}
                    className={cn(
                      "inline-flex items-center gap-2 border px-3 py-1.5 text-[11px] tracking-[0.1em] transition-all cursor-pointer",
                      isSelected
                        ? "border-[#161616] bg-[#161616] text-[#FAF8F5]"
                        : "border-[#E5DFD5] bg-[#FAF8F5] text-[#6B655E] hover:border-[#A68352] hover:text-[#161616]"
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-[#A68352]/60"
                      style={{ backgroundColor: perfume.accentHex }}
                    />
                    {perfume.name}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
