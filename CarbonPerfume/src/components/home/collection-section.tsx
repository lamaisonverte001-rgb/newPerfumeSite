"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { PerfumeDTO } from "@/types/perfume";
import {
  OLFACTORY_FAMILIES,
  type OlfactoryFamilyFilter,
} from "@/config/brand";
import { PerfumeCard } from "@/components/perfume/perfume-card";
import { cn } from "@/lib/utils";

interface CollectionSectionProps {
  perfumes: PerfumeDTO[];
}

export function CollectionSection({ perfumes }: CollectionSectionProps) {
  const [activeFamily, setActiveFamily] =
    useState<OlfactoryFamilyFilter>("Tous");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPerfumes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return perfumes.filter((p) => {
      const matchesFamily =
        activeFamily === "Tous" || p.olfactoryFamily === activeFamily;
      if (!matchesFamily) return false;
      if (!query) return true;

      const haystack = [
        p.name,
        p.subtitle,
        p.olfactoryFamily,
        ...p.topNotes,
        ...p.heartNotes,
        ...p.baseNotes,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [perfumes, activeFamily, searchQuery]);

  return (
    <section
      id="collection"
      className="scroll-mt-20 border-b border-[#E5DFD5] bg-[#FAF8F5] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Editorial Heading */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
              Catalogue Permanent
            </p>
            <h2 className="mt-3 font-serif text-4xl font-normal text-[#161616] sm:text-5xl">
              La Collection des Extraits
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#6B655E]">
            Chaque création est proposée en format 50&nbsp;ml et 100&nbsp;ml, embouteillée à la commande dans notre flacon apothicaire à col doré.
          </p>
        </div>

        {/* Filter Bar + Quick Search */}
        <div className="mt-12 flex flex-col justify-between gap-5 border-y border-[#E5DFD5] py-5 lg:flex-row lg:items-center">
          <div
            role="tablist"
            aria-label="Filtrer par famille olfactive"
            className="flex flex-wrap items-center gap-2"
          >
            {OLFACTORY_FAMILIES.map((family) => {
              const isActive = activeFamily === family;
              return (
                <button
                  key={family}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFamily(family)}
                  className={cn(
                    "px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all cursor-pointer",
                    isActive
                      ? "bg-[#161616] text-[#FAF8F5]"
                      : "border border-transparent text-[#6B655E] hover:border-[#E5DFD5] hover:bg-[#F2EDE6] hover:text-[#161616]"
                  )}
                >
                  {family}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B655E]" />
            <label htmlFor="collection-search" className="sr-only">
              Rechercher un parfum ou une note olfactive
            </label>
            <input
              id="collection-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Note, matière, nom…"
              className="h-10 w-full border border-[#E5DFD5] bg-[#FFFDF9] pl-10 pr-9 text-xs text-[#161616] placeholder:text-[#6B655E] focus:border-[#A68352] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Effacer la recherche"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#6B655E] hover:text-[#161616] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Perfume Grid */}
        {filteredPerfumes.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-[#161616]">
              Aucune création ne correspond à votre recherche.
            </p>
            <p className="mt-2 text-sm text-[#6B655E]">
              Essayez une autre famille olfactive ou réinitialisez les filtres.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFamily("Tous");
                setSearchQuery("");
              }}
              className="mt-6 border border-[#161616] px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-[#161616] transition-colors hover:bg-[#161616] hover:text-[#FAF8F5] cursor-pointer"
            >
              Afficher toute la collection
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredPerfumes.map((perfume) => (
                <motion.div
                  key={perfume.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                >
                  <PerfumeCard perfume={perfume} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
