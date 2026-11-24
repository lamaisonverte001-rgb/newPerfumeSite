"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { cn, formatPrice } from "@/lib/utils";
import type { PerfumeWithVariants } from "@/types/perfume";

interface PerfumeCardProps {
  perfume: PerfumeWithVariants;
  index?: number;
}

export function PerfumeCard({ perfume, index = 0 }: PerfumeCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    perfume.variants[0]?.id ?? ""
  );

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const activeVariant =
    perfume.variants.find((v) => v.id === selectedVariantId) ??
    perfume.variants[0];

  const isOutOfStock = !activeVariant || activeVariant.stock <= 0;

  function handleQuickAdd() {
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
    toast.success(`${perfume.name} (${activeVariant.volumeMl} ml) ajouté au panier.`);
    openCart();
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.3) }}
      className="group flex flex-col border border-[#E5DFD5] bg-[#FAF8F5] transition-colors duration-300 hover:border-[#A68352]/65"
    >
      {/* Visuel flacon sur pierre douce */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F2EDE6]">
        <Link
          href={`/parfums/${perfume.slug}`}
          className="block h-full w-full"
          aria-label={`Découvrir ${perfume.name}`}
        >
          <Image
            src={perfume.imageUrl}
            alt={`Flacon ${perfume.name} — ${perfume.subtitle}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </Link>

        {/* Étiquette discrète famille olfactive */}
        <span className="pointer-events-none absolute left-4 top-4 border border-[#E5DFD5] bg-[#FAF8F5]/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#6B655E] backdrop-blur-sm">
          {perfume.olfactoryFamily}
        </span>

        {/* Bouton d'ajout rapide élégant au survol (toujours accessible mobile/clavier) */}
        <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-95 transition-all duration-300 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus-within:translate-y-0 sm:focus-within:opacity-100">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            className="flex h-11 w-full items-center justify-center gap-2 bg-[#161616]/95 px-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#FAF8F5] backdrop-blur-sm transition-colors hover:bg-[#A68352] disabled:bg-[#6B655E]/60 cursor-pointer"
          >
            {isOutOfStock ? (
              "Épuisé"
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
                Ajouter au panier
              </>
            )}
          </button>
        </div>
      </div>

      {/* Informations éditoriales & sélecteur format */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/parfums/${perfume.slug}`}
              className="font-serif text-2xl font-normal leading-snug text-[#161616] transition-colors hover:text-[#A68352]"
            >
              {perfume.name}
            </Link>
            {activeVariant && (
              <span className="font-serif text-xl text-[#161616] shrink-0">
                {formatPrice(activeVariant.priceCents)}
              </span>
            )}
          </div>

          <p className="mt-1.5 text-xs leading-relaxed text-[#6B655E]">
            {[...perfume.topNotes.slice(0, 2), perfume.baseNotes[0]]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>

        {/* Sélecteur rapide 50 ml / 100 ml + ajout compact */}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#E5DFD5] pt-4">
          <div
            role="radiogroup"
            aria-label={`Contenance pour ${perfume.name}`}
            className="inline-flex items-center gap-1.5"
          >
            {perfume.variants.map((variant) => {
              const selected = variant.id === activeVariant?.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={cn(
                    "border px-2.5 py-1 text-[11px] tracking-[0.1em] transition-colors cursor-pointer",
                    selected
                      ? "border-[#161616] bg-[#161616] text-[#FAF8F5]"
                      : "border-[#E5DFD5] bg-transparent text-[#6B655E] hover:border-[#A68352] hover:text-[#161616]"
                  )}
                >
                  {variant.volumeMl} ml
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            aria-label={`Ajouter ${perfume.name} ${activeVariant?.volumeMl ?? 50} ml au panier`}
            className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#161616] transition-colors hover:text-[#A68352] disabled:opacity-40 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Ajouter
          </button>
        </div>
      </div>
    </motion.article>
  );
}
