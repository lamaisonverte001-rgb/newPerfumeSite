"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { Hero3DViewer } from "@/components/three/hero-3d-viewer";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#E5DFD5] bg-[#FAF8F5] pt-24 pb-16 sm:pt-28 lg:min-h-[92vh] lg:pt-32 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Editorial Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#A68352]">
              {BRAND_CONFIG.atelierOrigin} — Collection Permanente
            </p>

            <h1 className="mt-5 font-serif text-5xl font-normal leading-[1.05] tracking-[-0.01em] text-[#161616] sm:text-6xl xl:text-[4.35rem]">
              L&apos;architecture invisible des grands sillages.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#6B655E] sm:text-lg">
              Chez <span className="font-medium text-[#161616]">{BRAND_CONFIG.name}</span>, chaque flacon renferme un extrait de parfum concentré entre 24&nbsp;% et 30&nbsp;%, lentement macéré en cuve à Grasse à partir d&apos;absolus floraux, de bois rares et de résines naturelles.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" variant="primary" id="hero-cta-collection">
                <Link href="#collection">
                  <span>Découvrir la Collection</span>
                  <ArrowDownRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" id="hero-cta-quiz">
                <Link href="#diagnostic">Trouver ma signature</Link>
              </Button>
            </div>

            {/* Minimalist Atelier Figures */}
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-[#E5DFD5] pt-8">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-[#6B655E]">
                  Concentration
                </dt>
                <dd className="mt-1 font-serif text-2xl text-[#161616] sm:text-3xl">
                  24 – 30 %
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-[#6B655E]">
                  Macération
                </dt>
                <dd className="mt-1 font-serif text-2xl text-[#161616] sm:text-3xl">
                  8 Semaines
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-[#6B655E]">
                  Savoir-Faire
                </dt>
                <dd className="mt-1 font-serif text-2xl text-[#161616] sm:text-3xl">
                  Grasse
                </dd>
              </div>
            </dl>
          </motion.div>

          {/* Interactive 3D Flacon Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <Hero3DViewer />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
