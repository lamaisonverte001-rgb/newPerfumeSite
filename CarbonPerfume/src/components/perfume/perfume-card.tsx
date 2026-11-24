"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import type { PerfumeDTO, PerfumeVariantDTO } from "@/types/perfume";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PerfumeCardProps {
  perfume: PerfumeDTO;
}

export function PerfumeCard({ perfume }: PerfumeCardProps) {
  const defaultVariant: PerfumeVariantDTO | undefined =
    perfume.variants.find((v) => v.volumeMl === 50) ?? perfume.variants[0];

  const [selectedVolume, setSelectedVolume] = useState<number>(
    defaultVariant?.volumeMl ?? 50
  );

  const addItem = useCartStore((s) => s.addItem);

  const activeVariant =
    perfume.variants.find((v) => v.volumeMl === selectedVolume) ??
    defaultVariant;

  const isOutOfStock = !activeVariant || activeVariant.stock <= 0;

  const mainNotes = [
    perfume.topNotes[0],
    perfume.heartNotes[0],
    perfume.baseNotes[0],
  ].filter(Boolean);

  const handleAddToCart = () => {
    if (!activeVariant || activeVariant.stock <= 0) return;

    addItem(
      {
        variantId: activeVariant.id,
        perfumeId: perfume.id,
        slug: perfume.slug,
        perfumeName: perfume.name,
        olfactoryFamily: perfume.olfactoryFamily,
        volumeMl: activeVariant.volumeMl,
        priceCents: activeVariant.priceCents,
        sku: activeVariant.sku,
        imageUrl: perfume.imageUrl,
        maxStock: activeVariant.stock,
      },
      1,
      true
    );

    toast.success(`${perfume.name} (${activeVariant.volumeMl} ml) ajouté à votre écrin.`);
  };

  return (
    <article className="group flex flex-col border border-[#E5DFD5] bg-[#FAF8F5] transition-colors duration-500 hover:border-[#A68352]/60">
      {/* Image Stage */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F2EDE6]">
        {/* Top subtle olfactory family tag */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: perfume.accentColor }}
          />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#6B655E]">
            {perfume.olfactoryFamily}
          </span>
        </div>

        <Link
          href={`/parfums/${perfume.slug}`}
          aria-label={`Découvrir ${perfume.name}`}
          className="relative block h-full w-full p-7 sm:p-9"
        >
          <div className="relative h-full w-full">
            <Image
              src={perfume.imageUrl}
              alt={`${perfume.name} — Flacon Parfum Intense`}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          </div>
        </Link>

        {/* Quick hover discovery link on desktop */}
        <Link
          href={`/parfums/${perfume.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center border border-[#E5DFD5] bg-[#FAF8F5]/90 text-[#161616] opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100"
        >
          <ArrowUpRight className="h-4 w-4 stroke-[1.5]" />
        </Link>
      </div>

      {/* Editorial Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <Link href={`/parfums/${perfume.slug}`}>
              <h3 className="font-serif text-2xl font-normal tracking-wide text-[#161616] transition-colors group-hover:text-[#A68352]">
                {perfume.name}
              </h3>
            </Link>
            {activeVariant && (
              <span className="font-serif text-xl font-medium tabular-nums text-[#161616]">
                {formatPrice(activeVariant.priceCents)}
              </span>
            )}
          </div>

          <p className="mt-1.5 line-clamp-1 text-xs text-[#6B655E]">
            {mainNotes.join(" • ")}
          </p>
        </div>

        {/* Format Selector (50 ml / 100 ml) + Add to Cart */}
        <div className="mt-6 space-y-3 border-t border-[#E5DFD5] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#6B655E]">
              Contenance
            </span>
            <div
              role="group"
              aria-label={`Choisir le format pour ${perfume.name}`}
              className="inline-flex border border-[#E5DFD5] bg-[#F2EDE6]/60 p-0.5"
            >
              {perfume.variants.map((variant) => {
                const isSelected = variant.volumeMl === selectedVolume;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVolume(variant.volumeMl)}
                    className={cn(
                      "px-3 py-1 text-[11px] font-medium tracking-wider transition-all cursor-pointer",
                      isSelected
                        ? "bg-[#161616] text-[#FAF8F5]"
                        : "text-[#6B655E] hover:text-[#161616]"
                    )}
                  >
                    {variant.volumeMl} ml
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            type="button"
            variant={isOutOfStock ? "subtle" : "primary"}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="h-11 w-full"
          >
            <ShoppingBag className="h-3.5 w-3.5 stroke-[1.6]" />
            <span>
              {isOutOfStock ? "Momentanément épuisé" : "Ajouter au panier"}
            </span>
          </Button>
        </div>
      </div>
    </article>
  );
}
