"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore, computeCartTotals } from "@/store/cart-store";
import { BRAND_CONFIG } from "@/config/brand";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const {
    totalCount,
    subtotalCents,
    remainingForFreeShippingCents,
    freeShippingProgress,
  } = computeCartTotals(items);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (!open ? closeCart() : undefined)}>
      <SheetContent className="flex flex-col justify-between p-0">
        {/* Header */}
        <div className="border-b border-[#E5DFD5] px-6 pb-5 pt-6">
          <div className="flex items-baseline gap-3 pr-10">
            <SheetTitle>Votre Panier</SheetTitle>
            <span className="text-xs uppercase tracking-[0.18em] text-[#6B655E]">
              ({totalCount} {totalCount > 1 ? "flacons" : "flacon"})
            </span>
          </div>
          <SheetDescription className="sr-only">
            Récapitulatif des parfums sélectionnés et progression vers la livraison offerte.
          </SheetDescription>

          {/* Dynamic Free Shipping Progress Bar (threshold 120 €) */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              {remainingForFreeShippingCents === 0 && subtotalCents > 0 ? (
                <span className="font-medium text-[#161616]">
                  Livraison offerte débloquée pour votre écrin
                </span>
              ) : (
                <span className="text-[#6B655E]">
                  Plus que{" "}
                  <strong className="font-medium text-[#161616]">
                    {formatPrice(remainingForFreeShippingCents)}
                  </strong>{" "}
                  avant la livraison offerte
                </span>
              )}
              <span className="text-[11px] tabular-nums text-[#A68352]">
                {subtotalCents > 0 ? `${freeShippingProgress}%` : "120 €"}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden bg-[#E5DFD5]">
              <div
                className="h-full bg-[#A68352] transition-all duration-500 ease-out"
                style={{ width: `${subtotalCents > 0 ? freeShippingProgress : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cart Items List */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#E5DFD5] bg-[#F2EDE6]">
                <ShoppingBag className="h-6 w-6 stroke-[1.3] text-[#6B655E]" />
              </div>
              <p className="font-serif text-2xl text-[#161616]">
                Votre écrin est vide
              </p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#6B655E]">
                Explorez nos créations composées à Grasse et laissez-vous guider par nos familles olfactives.
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-7"
                onClick={closeCart}
              >
                <Link href="/#collection">Découvrir la Collection</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-[#E5DFD5]">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4 py-5 first:pt-1">
                  <Link
                    href={`/parfums/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-24 w-20 shrink-0 overflow-hidden border border-[#E5DFD5] bg-[#F2EDE6] p-2"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.perfumeName}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5 transition-transform duration-300 hover:scale-105"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/parfums/${item.slug}`}
                          onClick={closeCart}
                          className="font-serif text-lg leading-tight text-[#161616] hover:text-[#A68352]"
                        >
                          {item.perfumeName}
                        </Link>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-[#6B655E]">
                          Parfum Intense • {item.volumeMl} ml
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label={`Retirer ${item.perfumeName} du panier`}
                        onClick={() => removeItem(item.variantId)}
                        className="p-1 text-[#6B655E] transition-colors hover:text-[#9B2C2C] cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#E5DFD5] bg-[#FFFDF9]">
                        <button
                          type="button"
                          aria-label="Diminuer la quantité"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center text-[#161616] transition-colors hover:bg-[#F2EDE6] cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-7 text-center text-xs font-medium tabular-nums text-[#161616]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Augmenter la quantité"
                          disabled={item.quantity >= item.maxStock}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center text-[#161616] transition-colors hover:bg-[#F2EDE6] disabled:opacity-35 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-sm font-medium tabular-nums text-[#161616]">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E5DFD5] bg-[#F2EDE6]/65 px-6 py-5">
            <div className="mb-4 flex items-center gap-2.5 border border-[#E5DFD5] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#6B655E]">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#A68352]" />
              <span>
                {BRAND_CONFIG.complimentarySamplesCount} échantillons signature (2 ml) offerts dans votre coffret.
              </span>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-[#6B655E]">
                <span>Livraison</span>
                <span>
                  {remainingForFreeShippingCents === 0
                    ? "Offerte"
                    : formatPrice(BRAND_CONFIG.standardShippingCents)}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#161616]">
                  Sous-total
                </span>
                <span className="font-serif text-2xl font-medium tabular-nums text-[#161616]">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
            </div>

            <Button
              asChild
              variant="primary"
              size="lg"
              className="mt-5 w-full"
              onClick={closeCart}
            >
              <Link href="/checkout">
                <span>Passer la commande</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
