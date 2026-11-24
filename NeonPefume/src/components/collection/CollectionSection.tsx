"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  OLFACTORY_FAMILIES,
  type OlfactoryFamilyFilter,
  cn,
} from "@/lib/utils";
import { PerfumeCard } from "@/components/collection/PerfumeCard";
import type { PerfumeWithVariants } from "@/types/perfume";

interface CollectionSectionProps {
  perfumes: PerfumeWithVariants[];
}

export function CollectionSection({ perfumes }: CollectionSectionProps) {
  const [selectedFamily, setSelectedFamily] =
    useState<OlfactoryFamilyFilter>("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPerfumes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return perfumes.filter((perfume) => {
      const matchesFamily =
        selectedFamily === "Tous" ||
        perfume.olfactoryFamily === selectedFamily;

      if (!matchesFamily) return false;
      if (!q) return true;

      const haystack = [
        perfume.name,
        perfume.subtitle,
        perfume.olfactoryFamily,
        ...perfume.topNotes,
        ...perfume.heartNotes,
        ...perfume.baseNotes,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [perfumes, selectedFamily, searchQuery]);

  return (
    <section
      id="collection"
      className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28"
    >
      {/* En-tête éditorial */}
      <div className="flex flex-col justify-between gap-6 border-b border-[#E5DFD5] pb-10 lg:flex-row lg:items-end">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
            La Collection Permanente
          </p>
          <h2 className="mt-3 font-serif text-4xl font-light text-[#161616] sm:text-5xl">
            Nos Créations Olfactives
          </h2>
        </div>

        <p className="max-w-md text-sm leading-relaxed text-[#6B655E]">
          Chaque extrait est décliné en flacon de 50 ml et 100 ml, pensé comme
          une signature singulière façonnée autour de matières premières d&apos;exception.
        </p>
      </div>

      {/* Barre de filtres & recherche */}
      <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Filtrer par famille olfactive"
          className="flex flex-wrap items-center gap-2"
        >
          {OLFACTORY_FAMILIES.map((family) => {
            const active = selectedFamily === family;
            return (
              <button
                key={family}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedFamily(family)}
                className={cn(
                  "border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors cursor-pointer",
                  active
                    ? "border-[#161616] bg-[#161616] text-[#FAF8F5]"
                    : "border-[#E5DFD5] bg-transparent text-[#6B655E] hover:border-[#A68352] hover:text-[#161616]"
                )}
              >
                {family}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B655E]"
            strokeWidth={1.5}
          />
          <label htmlFor="collection-search" className="sr-only">
            Rechercher un parfum ou une note
          </label>
          <input
            id="collection-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une note, un nom..."
            className="h-10 w-full border border-[#E5DFD5] bg-[#FAF8F5] pl-10 pr-9 text-xs text-[#161616] placeholder:text-[#6B655E]/70 transition-colors focus:border-[#A68352] focus:outline-none"
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

      {/* Grille des parfums */}
      {filteredPerfumes.length === 0 ? (
        <div className="mt-14 border border-[#E5DFD5] bg-[#F2EDE6]/55 px-8 py-16 text-center">
          <p className="font-serif text-2xl text-[#161616]">
            Aucune création ne correspond à cette recherche.
          </p>
          <p className="mt-2 text-xs text-[#6B655E]">
            Essayez une autre famille olfactive ou une note telle que « vanille »,
            « cèdre » ou « bergamote ».
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFamily("Tous");
              setSearchQuery("");
            }}
            className="mt-6 border border-[#161616] px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#161616] transition-colors hover:bg-[#161616] hover:text-[#FAF8F5] cursor-pointer"
          >
            Afficher toute la collection
          </button>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPerfumes.map((perfume, idx) => (
            <PerfumeCard key={perfume.id} perfume={perfume} index={idx} />
          ))}
        </div>
      )}
    </section>
  );
}
