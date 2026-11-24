"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Minus,
  Plus,
  Check,
  Sparkles,
  Clock,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import type { PerfumeDTO, PerfumeVariantDTO } from "@/types/perfume";
import { BRAND_CONFIG } from "@/config/brand";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function PerfumeDetailClient({ perfume }: { perfume: PerfumeDTO }) {
  const initialVariant: PerfumeVariantDTO | undefined =
    perfume.variants.find((v) => v.volumeMl === 50) ?? perfume.variants[0];

  const [selectedVolume, setSelectedVolume] = useState<number>(
    initialVariant?.volumeMl ?? 50
  );
  const [quantity, setQuantity] = useState<number>(1);

  const addItem = useCartStore((s) => s.addItem);

  const activeVariant =
    perfume.variants.find((v) => v.volumeMl === selectedVolume) ??
    initialVariant;

  const stock = activeVariant?.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleVolumeChange = (volume: number) => {
    setSelectedVolume(volume);
    const target = perfume.variants.find((v) => v.volumeMl === volume);
    if (target && quantity > target.stock && target.stock > 0) {
      setQuantity(target.stock);
    } else if (quantity < 1) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (!activeVariant || isOutOfStock) return;

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
      quantity,
      true
    );

    toast.success(
      `${quantity} × ${perfume.name} (${activeVariant.volumeMl} ml) ajouté à votre écrin.`
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-20 sm:px-8 lg:px-12 lg:pt-32">
      {/* Breadcrumb */}
      <nav
        aria-label="Fil d'Ariane"
        className="mb-8 flex items-center gap-2 text-xs text-[#6B655E]"
      >
        <Link href="/" className="hover:text-[#161616]">
          Accueil
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/#collection" className="hover:text-[#161616]">
          Collection
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#161616]">{perfume.name}</span>
      </nav>

      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: High-Definition Flacon Showcase */}
        <div className="lg:sticky lg:top-28 lg:col-span-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#E5DFD5] bg-[#F2EDE6]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                background: `radial-gradient(circle at 50% 45%, ${perfume.accentColor}55 0%, transparent 68%)`,
              }}
            />

            <div className="absolute left-6 top-6 z-10 flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: perfume.accentColor }}
              />
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#161616]">
                Famille {perfume.olfactoryFamily}
              </span>
            </div>

            <div className="relative h-full w-full p-8 sm:p-14">
              <Image
                src={perfume.imageUrl}
                alt={`${perfume.name} — ${BRAND_CONFIG.name}`}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 48vw"
                className="object-contain p-6 sm:p-10"
              />
            </div>

            <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between border-t border-[#E5DFD5]/80 pt-3 text-[11px] uppercase tracking-[0.18em] text-[#6B655E]">
              <span>Extrait Concentré</span>
              <span>Réf. {activeVariant?.sku ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* Right: Product Information & Purchase Controls */}
        <div className="lg:col-span-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
            {BRAND_CONFIG.name} • Parfum Intense
          </p>

          <h1 className="mt-3 font-serif text-4xl font-normal text-[#161616] sm:text-5xl">
            {perfume.name}
          </h1>

          <p className="mt-2 font-serif text-xl italic text-[#6B655E]">
            {perfume.subtitle}
          </p>

          {/* Dynamic Price & Stock Status */}
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-y border-[#E5DFD5] py-5">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-medium tabular-nums text-[#161616] sm:text-4xl">
                {activeVariant ? formatPrice(activeVariant.priceCents) : "—"}
              </span>
              <span className="text-xs text-[#6B655E]">TTC</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {isOutOfStock ? (
                <span className="font-medium text-[#9B2C2C]">
                  Momentanément épuisé
                </span>
              ) : isLowStock ? (
                <span className="font-medium text-[#A68352]">
                  Édition limitée — Plus que {stock} flacon{stock > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[#2F5D46]">
                  <Check className="h-3.5 w-3.5" />
                  En stock ({stock} disponibles) • SKU {activeVariant?.sku}
                </span>
              )}
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-[#6B655E] sm:text-base">
            {perfume.description}
          </p>

          {/* Volume Selector (50 ml / 100 ml) */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#161616]">
                Choisir la contenance
              </span>
              <span className="text-xs text-[#6B655E]">
                Vaporisateur rechargeable
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3.5">
              {perfume.variants.map((variant) => {
                const selected = variant.volumeMl === selectedVolume;
                const exhausted = variant.stock <= 0;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    id={`select-volume-${variant.volumeMl}`}
                    onClick={() => handleVolumeChange(variant.volumeMl)}
                    className={cn(
                      "flex items-center justify-between border p-4 text-left transition-all cursor-pointer",
                      selected
                        ? "border-[#161616] bg-[#F2EDE6]"
                        : "border-[#E5DFD5] bg-[#FFFDF9] hover:border-[#A68352]",
                      exhausted && "opacity-55"
                    )}
                  >
                    <div>
                      <span className="block text-sm font-medium text-[#161616]">
                        {variant.volumeMl} ml
                      </span>
                      <span className="text-[11px] text-[#6B655E]">
                        {variant.volumeMl === 50 ? "1.69 fl. oz" : "3.38 fl. oz"}
                      </span>
                    </div>
                    <span className="font-serif text-xl font-medium tabular-nums text-[#161616]">
                      {formatPrice(variant.priceCents)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Add to Cart CTA */}
          <div className="mt-7 flex flex-col gap-3.5 sm:flex-row">
            <div className="inline-flex h-14 items-center justify-between border border-[#E5DFD5] bg-[#FFFDF9] px-3 sm:w-36">
              <button
                type="button"
                aria-label="Réduire la quantité"
                disabled={quantity <= 1 || isOutOfStock}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 text-[#161616] disabled:opacity-35 cursor-pointer"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-sm font-medium tabular-nums text-[#161616]">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Augmenter la quantité"
                disabled={isOutOfStock || quantity >= stock}
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                className="p-2 text-[#161616] disabled:opacity-35 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <Button
              type="button"
              id="product-add-to-cart"
              size="lg"
              variant={isOutOfStock ? "subtle" : "primary"}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="flex-1"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>
                {isOutOfStock
                  ? "Rupture temporaire"
                  : `Ajouter au panier — ${
                      activeVariant
                        ? formatPrice(activeVariant.priceCents * quantity)
                        : ""
                    }`}
              </span>
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-[#6B655E]">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#A68352]" />
            <span>
              2 échantillons offerts (dont un échantillon d&apos;essai de {perfume.name}) + livraison offerte dès 120&nbsp;€.
            </span>
          </div>

          {/* Visual Intensity (1 to 5) & Longevity Indicators */}
          <div className="mt-9 grid grid-cols-1 gap-4 border border-[#E5DFD5] bg-[#F2EDE6]/55 p-5 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-[0.18em] text-[#6B655E]">
                  Intensité
                </span>
                <span className="font-medium text-[#161616]">
                  {perfume.intensity} / 5
                </span>
              </div>
              <div
                aria-label={`Intensité ${perfume.intensity} sur 5`}
                className="mt-3 flex gap-1.5"
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <span
                    key={level}
                    className={cn(
                      "h-1.5 flex-1 transition-colors",
                      level <= perfume.intensity
                        ? "bg-[#A68352]"
                        : "bg-[#E5DFD5]"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="sm:border-l sm:border-[#E5DFD5] sm:pl-5">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-[#6B655E]">
                <Clock className="h-3.5 w-3.5 text-[#A68352]" />
                <span>Tenue sur peau</span>
              </div>
              <p className="mt-2 font-serif text-lg text-[#161616]">
                {perfume.longevity}
              </p>
            </div>
          </div>

          {/* 3-Tier Visual Olfactory Pyramid */}
          <div className="mt-9 border border-[#E5DFD5] bg-[#FFFDF9] p-6">
            <h2 className="text-xs font-medium uppercase tracking-[0.22em] text-[#A68352]">
              Pyramide Olfactive
            </h2>

            <div className="mt-6 space-y-5">
              {/* Top Notes */}
              <div className="mx-auto max-w-[78%] border-b border-[#E5DFD5] pb-4 text-center">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#6B655E]">
                  I. Notes de Tête — L&apos;Envolée
                </span>
                <p className="mt-1.5 font-serif text-xl text-[#161616]">
                  {perfume.topNotes.join(" • ")}
                </p>
              </div>

              {/* Heart Notes */}
              <div className="mx-auto max-w-[90%] border-b border-[#E5DFD5] pb-4 text-center">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#6B655E]">
                  II. Notes de Cœur — L&apos;Âme
                </span>
                <p className="mt-1.5 font-serif text-xl text-[#161616]">
                  {perfume.heartNotes.join(" • ")}
                </p>
              </div>

              {/* Base Notes */}
              <div className="mx-auto w-full text-center">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#6B655E]">
                  III. Notes de Fond — Le Sillage
                </span>
                <p className="mt-1.5 font-serif text-xl text-[#161616]">
                  {perfume.baseNotes.join(" • ")}
                </p>
              </div>
            </div>
          </div>

          {/* Product Details Accordions */}
          <Accordion
            type="single"
            collapsible
            defaultValue="story"
            className="mt-8 border-t border-[#E5DFD5]"
          >
            <AccordionItem value="story">
              <AccordionTrigger>Histoire du parfum</AccordionTrigger>
              <AccordionContent>{perfume.story}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="ingredients">
              <AccordionTrigger>Liste des ingrédients &amp; concentration</AccordionTrigger>
              <AccordionContent>{perfume.ingredients}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger>Livraison, essai sur peau &amp; retours</AccordionTrigger>
              <AccordionContent>
                Chaque flacon est accompagné d&apos;une fiole d&apos;essai offerte vous permettant de porter le parfum plusieurs jours avant de desceller votre coffret principal. Livraison offerte dès 120&nbsp;€ d&apos;achat (9&nbsp;€ en deçà). Retours gratuits sous 30 jours pour tout coffret non ouvert.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
