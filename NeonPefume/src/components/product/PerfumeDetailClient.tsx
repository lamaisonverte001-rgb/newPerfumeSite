"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  Clock,
  Flame,
  Gift,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn, formatPrice } from "@/lib/utils";
import type { PerfumeWithVariants } from "@/types/perfume";

interface PerfumeDetailClientProps {
  perfume: PerfumeWithVariants;
}

export function PerfumeDetailClient({ perfume }: PerfumeDetailClientProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    perfume.variants[0]?.id ?? ""
  );

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const activeVariant =
    perfume.variants.find((v) => v.id === selectedVariantId) ??
    perfume.variants[0];

  const isOutOfStock = !activeVariant || activeVariant.stock <= 0;
  const isLowStock =
    activeVariant && activeVariant.stock > 0 && activeVariant.stock <= 5;

  function handleAddToCart() {
    if (!activeVariant || isOutOfStock) return;
    addItem({
      variantId: activeVariant.id,
      perfumeId: perfume.id,
      slug: perfume.slug,
      name: perfume.name,
      subtitle: perfume.subtitle,
      imageUrl: perfume.imageUrl,
      volumeMl: activeVariant.volumeMl,
      priceCents: activeVariant.priceCents,
      sku: activeVariant.sku,
      maxStock: activeVariant.stock,
    });
    toast.success(
      `${perfume.name} (${activeVariant.volumeMl} ml) ajouté à votre panier.`
    );
    openCart();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 pb-20 lg:px-10 lg:pt-36">
      <Link
        href="/#collection"
        className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#6B655E] transition-colors hover:text-[#161616]"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Retour à la Collection
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Colonne visuelle haute définition du flacon */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="lg:col-span-6"
        >
          <div className="sticky top-28 border border-[#E5DFD5] bg-[#F2EDE6] p-8 sm:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 50% 45%, ${perfume.accentHex}24 0%, transparent 65%)`,
              }}
            />
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
              <Image
                src={perfume.imageUrl}
                alt={`Flacon ${perfume.name} — ${perfume.subtitle}`}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-contain drop-shadow-[0_26px_36px_rgba(36,28,18,0.14)]"
              />
            </div>
          </div>
        </motion.div>

        {/* Colonne détails, pyramide & ajout panier */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="lg:col-span-6"
        >
          <div className="flex items-center gap-3">
            <span className="border border-[#E5DFD5] bg-[#F2EDE6] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#A68352]">
              {perfume.olfactoryFamily}
            </span>
            {activeVariant && (
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#6B655E]">
                Réf. {activeVariant.sku}
              </span>
            )}
          </div>

          <h1 className="mt-4 font-serif text-4xl font-light text-[#161616] sm:text-5xl">
            {perfume.name}
          </h1>
          <p className="mt-1.5 text-xs uppercase tracking-[0.18em] text-[#6B655E]">
            {perfume.subtitle}
          </p>

          <p className="mt-6 text-sm leading-relaxed text-[#6B655E] sm:text-base">
            {perfume.description}
          </p>

          {/* Prix & Sélecteur de contenance */}
          <div className="mt-8 border-y border-[#E5DFD5] py-7">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#161616]">
                Contenance
              </span>
              {activeVariant && (
                <span className="font-serif text-3xl font-normal text-[#161616]">
                  {formatPrice(activeVariant.priceCents)}
                </span>
              )}
            </div>

            <div
              role="radiogroup"
              aria-label="Sélectionner la contenance"
              className="mt-4 grid grid-cols-2 gap-3"
            >
              {perfume.variants.map((variant) => {
                const selected = variant.id === activeVariant?.id;
                const soldOut = variant.stock <= 0;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={cn(
                      "flex flex-col items-start border p-4 text-left transition-all cursor-pointer",
                      selected
                        ? "border-[#161616] bg-[#161616] text-[#FAF8F5]"
                        : "border-[#E5DFD5] bg-[#FAF8F5] text-[#161616] hover:border-[#A68352]"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm font-medium tracking-[0.1em]">
                        {variant.volumeMl} ml
                      </span>
                      <span className="font-serif text-lg">
                        {formatPrice(variant.priceCents)}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "mt-1 text-[11px]",
                        selected ? "text-[#FAF8F5]/75" : "text-[#6B655E]"
                      )}
                    >
                      {soldOut
                        ? "Momentanément épuisé"
                        : variant.volumeMl === 50
                          ? "Format Voyage & Découverte"
                          : "Flacon Atelier · Meilleure valeur"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Indicateur de stock temps réel */}
            <div className="mt-4 flex items-center justify-between text-xs">
              {isOutOfStock ? (
                <span className="text-[#8B2C2C]">
                  Rupture de stock sur cette contenance
                </span>
              ) : isLowStock ? (
                <span className="text-[#8C6429]">
                  Plus que {activeVariant.stock} flacon
                  {activeVariant.stock > 1 ? "s" : ""} disponible
                  {activeVariant.stock > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[#2F5233]">
                  <Check className="h-3.5 w-3.5" />
                  En stock ({activeVariant?.stock} flacons disponibles) ·
                  Expédition sous 24h
                </span>
              )}
            </div>

            <Button
              type="button"
              size="lg"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="mt-6 w-full"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              {isOutOfStock
                ? "Indisponible"
                : `Ajouter au panier · ${formatPrice(activeVariant.priceCents)}`}
            </Button>

            <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-[#6B655E]">
              <div className="flex items-center gap-2">
                <Gift className="h-3.5 w-3.5 text-[#A68352]" strokeWidth={1.5} />
                2 échantillons offerts
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-[#A68352]" strokeWidth={1.5} />
                Livraison offerte dès 120 €
              </div>
            </div>
          </div>

          {/* Indicateurs Intensité & Tenue */}
          <div className="mt-8 grid grid-cols-2 gap-6 border-b border-[#E5DFD5] pb-8">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#6B655E]">
                <Flame className="h-3.5 w-3.5 text-[#A68352]" strokeWidth={1.5} />
                Intensité
              </div>
              <div
                className="mt-3 flex items-center gap-1.5"
                aria-label={`Intensité ${perfume.intensity} sur 5`}
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
              <p className="mt-2 text-xs text-[#161616]">
                {perfume.intensity} / 5 —{" "}
                {perfume.intensity >= 5
                  ? "Sillage Absolu"
                  : perfume.intensity === 4
                    ? "Présence Affirmée"
                    : "Voile Élégant"}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#6B655E]">
                <Clock className="h-3.5 w-3.5 text-[#A68352]" strokeWidth={1.5} />
                Tenue sur peau
              </div>
              <p className="mt-3 font-serif text-2xl font-normal text-[#161616]">
                {perfume.longevity}
              </p>
              <p className="mt-0.5 text-xs text-[#6B655E]">
                Concentration Parfum Intense
              </p>
            </div>
          </div>

          {/* Pyramide Olfactive Visuelle (3 niveaux) */}
          <div className="mt-8">
            <h2 className="text-xs font-medium uppercase tracking-[0.22em] text-[#161616]">
              Pyramide Olfactive
            </h2>

            <div className="mt-5 space-y-3">
              {[
                {
                  tier: "Notes de tête",
                  caption: "L'envolée — 0 à 20 min",
                  notes: perfume.topNotes,
                  widthClass: "sm:w-[76%] sm:mx-auto",
                },
                {
                  tier: "Notes de cœur",
                  caption: "L'âme du parfum — 1 à 5 h",
                  notes: perfume.heartNotes,
                  widthClass: "sm:w-[88%] sm:mx-auto",
                },
                {
                  tier: "Notes de fond",
                  caption: "L'empreinte — 6 à 12 h+",
                  notes: perfume.baseNotes,
                  widthClass: "w-full",
                },
              ].map((level) => (
                <div
                  key={level.tier}
                  className={cn(
                    "border border-[#E5DFD5] bg-[#F2EDE6]/70 px-5 py-4 text-center",
                    level.widthClass
                  )}
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#A68352]">
                    {level.tier} ·{" "}
                    <span className="text-[#6B655E]">{level.caption}</span>
                  </p>
                  <p className="mt-1.5 font-serif text-lg text-[#161616]">
                    {level.notes.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Accordéons : Histoire, Ingrédients, Livraison */}
          <Accordion
            type="single"
            collapsible
            defaultValue="story"
            className="mt-10 border-t border-[#E5DFD5]"
          >
            <AccordionItem value="story">
              <AccordionTrigger>Histoire du parfum</AccordionTrigger>
              <AccordionContent>{perfume.story}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="ingredients">
              <AccordionTrigger>Liste des ingrédients</AccordionTrigger>
              <AccordionContent>
                <p className="text-xs leading-relaxed">
                  {perfume.ingredients ||
                    "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin."}
                </p>
                <p className="mt-3 text-[11px] text-[#6B655E]">
                  Formulés sans colorants artificiels, non testés sur les animaux
                  et conformes à la réglementation cosmétique européenne.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger>Livraison &amp; retours</AccordionTrigger>
              <AccordionContent>
                <p>
                  Expédition suivie sous 24 à 48 heures ouvrées dans un écrin
                  protecteur accompagné de 2 échantillons offerts. Livraison
                  offerte dès 120 € d&apos;achat (sinon 9 €). Retours acceptés
                  sous 14 jours pour tout flacon non ouvert sous blister.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
