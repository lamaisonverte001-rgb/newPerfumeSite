"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types/perfume";
import { BRAND_CONFIG } from "@/config/brand";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    item: Omit<CartItem, "quantity">,
    quantity?: number,
    openDrawer?: boolean
  ) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (newItem, quantity = 1, openDrawer = true) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === newItem.variantId
          );
          const safeMax = Math.max(1, newItem.maxStock);

          if (existing) {
            const nextQty = Math.min(safeMax, existing.quantity + quantity);
            return {
              items: state.items.map((i) =>
                i.variantId === newItem.variantId
                  ? { ...i, ...newItem, quantity: nextQty }
                  : i
              ),
              isOpen: openDrawer ? true : state.isOpen,
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...newItem,
                quantity: Math.min(safeMax, Math.max(1, quantity)),
              },
            ],
            isOpen: openDrawer ? true : state.isOpen,
          };
        }),
      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),
      updateQuantity: (variantId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.variantId !== variantId),
            };
          }
          return {
            items: state.items.map((i) =>
              i.variantId === variantId
                ? { ...i, quantity: Math.min(Math.max(1, i.maxStock), quantity) }
                : i
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "carbon-perfume-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function computeCartTotals(items: CartItem[]) {
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalCents = items.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );
  const threshold = BRAND_CONFIG.freeShippingThresholdCents;
  const shippingCents =
    subtotalCents === 0 || subtotalCents >= threshold
      ? 0
      : BRAND_CONFIG.standardShippingCents;
  const totalCents = subtotalCents + shippingCents;
  const remainingForFreeShippingCents = Math.max(0, threshold - subtotalCents);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotalCents / threshold) * 100)
  );

  return {
    totalCount,
    subtotalCents,
    shippingCents,
    totalCents,
    remainingForFreeShippingCents,
    freeShippingProgress,
  };
}
