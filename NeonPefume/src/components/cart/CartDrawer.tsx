"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";
import {
  useCartStore,
  selectCartSubtotal,
  selectCartCount,
} from "@/store/cart-store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { calculateShippingCents, formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotalCents = useCartStore(selectCartSubtotal);
  const itemCount = useCartStore(selectCartCount);
  const shippingCents = calculateShippingCents(subtotalCents);

  const threshold = BRAND_CONFIG.freeShippingThresholdCents;
  const remaining = Math.max(0, threshold - subtotalCents);
  const progressPct = Math.min(100, Math.round((subtotalCents / threshold) * 100));

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (!open ? closeCart() : undefined)}>
      <SheetContent side="right" className="p-0">
        <SheetHeader>
          <SheetTitle>Votre Panier</SheetTitle>
          <SheetDescription>
            {itemCount === 0
              ? "Votre sélection est vide"
              : `${itemCount} flacon${itemCount > 1 ? "s" : ""} sélectionné${itemCount > 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        {/* Barre de progression livraison offerte */}
        <div className="border-b border-[#E5DFD5] bg-[#F2EDE6]/70 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-[#161616]">
            <Truck className="h-4 w-4 text-[#A68352]" strokeWidth={1.5} />
            {remaining === 0 && subtotalCents > 0 ? (
              <span>
                Félicitations — la <strong>livraison offerte</strong> est débloquée.
              </span>
            ) : (
              <span>
                Plus que{" "}
                <strong>
                  {formatPrice(subtotalCents === 0 ? threshold : remaining)}
                </strong>{" "}
                pour bénéficier de la livraison offerte.
              </span>
            )}
          </div>
          <div className="mt-2.5 h-1 w-full overflow-hidden bg-[#E5DFD5]">
            <div
              className="h-full bg-[#A68352] transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Liste des articles */}
        <div className="flex-1 overflow-y-auto px-6 py-5" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-14">
              <ShoppingBag
                className="h-10 w-10 text-[#A68352]/60"
                strokeWidth={1.2}
              />
              <p className="mt-4 font-serif text-xl text-[#161616]">
                Aucun flacon dans votre panier
              </p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#6B655E]">
                Découvrez nos parfums intenses composés à Grasse et profitez de
                deux échantillons offerts avec chaque commande.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={closeCart}
                asChild
              >
                <Link href="/#collection">Explorer la Collection</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-[#E5DFD5]">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4 py-5 first:pt-0">
                  <Link
                    href={`/parfums/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-24 w-20 shrink-0 overflow-hidden border border-[#E5DFD5] bg-[#F2EDE6]"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/parfums/${item.slug}`}
                          onClick={closeCart}
                          className="font-serif text-lg leading-tight text-[#161616] hover:text-[#A68352] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-[#6B655E]">
                          Parfum Intense · {item.volumeMl} ml
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Supprimer ${item.name}`}
                        onClick={() => removeItem(item.variantId)}
                        className="p-1 text-[#6B655E] hover:text-[#8B2C2C] transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#E5DFD5] bg-[#FAF8F5]">
                        <button
                          type="button"
                          aria-label="Diminuer la quantité"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center text-[#161616] hover:bg-[#F2EDE6] transition-colors cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[28px] text-center text-xs font-medium text-[#161616]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Augmenter la quantité"
                          disabled={item.quantity >= item.maxStock}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center text-[#161616] hover:bg-[#F2EDE6] transition-colors disabled:opacity-35 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="font-serif text-base text-[#161616]">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pied du panier */}
        {items.length > 0 && (
          <div className="border-t border-[#E5DFD5] bg-[#FAF8F5] px-6 py-5">
            <div className="space-y-2 text-xs text-[#6B655E]">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="text-[#161616] font-medium">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Livraison suivie</span>
                <span className="text-[#161616]">
                  {shippingCents === 0 ? "Offerte" : formatPrice(shippingCents)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#E5DFD5] pt-3 text-sm text-[#161616]">
                <span className="uppercase tracking-[0.14em] text-xs font-medium">
                  Total estimé
                </span>
                <span className="font-serif text-xl">
                  {formatPrice(subtotalCents + shippingCents)}
                </span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-[#6B655E]">
              + 2 échantillons découverte offerts dans chaque écrin.
            </p>

            <Button asChild className="mt-5 w-full" size="lg" onClick={closeCart}>
              <Link href="/checkout">Passer la commande</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
