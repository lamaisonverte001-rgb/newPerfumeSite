import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BRAND_CONFIG } from "@/config/brand";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat(BRAND_CONFIG.locale, {
    style: "currency",
    currency: BRAND_CONFIG.currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function calculateShippingCents(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= BRAND_CONFIG.freeShippingThresholdCents
    ? 0
    : BRAND_CONFIG.standardShippingCents;
}

export const OLFACTORY_FAMILIES = [
  "Tous",
  "Boisé",
  "Floral",
  "Ambré",
  "Hespéridé",
  "Épicé",
] as const;

export type OlfactoryFamilyFilter = (typeof OLFACTORY_FAMILIES)[number];

export const ORDER_STATUS_META = {
  PENDING: {
    label: "En attente",
    className: "bg-[#F2EDE6] text-[#6B655E] border-[#E5DFD5]",
  },
  PAID: {
    label: "Payée",
    className: "bg-[#EEF3EE] text-[#2F5233] border-[#C9DBC9]",
  },
  PREPARING: {
    label: "En préparation",
    className: "bg-[#F8F1E3] text-[#8C6429] border-[#E4D1B0]",
  },
  SHIPPED: {
    label: "Expédiée",
    className: "bg-[#E9F0F5] text-[#244E6B] border-[#C5D8E6]",
  },
  CANCELLED: {
    label: "Annulée",
    className: "bg-[#F7ECEC] text-[#8B2C2C] border-[#E2C2C2]",
  },
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUS_META;
