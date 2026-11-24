"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types/perfume";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.variantId === newItem.variantId
          );
          if (existing) {
            const nextQty = Math.min(
              existing.quantity + quantity,
              Math.max(1, newItem.maxStock)
            );
            return {
              items: state.items.map((item) =>
                item.variantId === newItem.variantId
                  ? { ...item, quantity: nextQty, maxStock: newItem.maxStock, priceCents: newItem.priceCents }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...newItem,
                quantity: Math.min(quantity, Math.max(1, newItem.maxStock)),
              },
            ],
          };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.variantId !== variantId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.variantId === variantId
                ? {
                    ...item,
                    quantity: Math.min(quantity, Math.max(1, item.maxStock)),
                  }
                : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "lmv-parfums-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function selectCartCount(state: CartState): number {
  return state.items.reduce((acc, item) => acc + item.quantity, 0);
}

export function selectCartSubtotal(state: CartState): number {
  return state.items.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );
}
