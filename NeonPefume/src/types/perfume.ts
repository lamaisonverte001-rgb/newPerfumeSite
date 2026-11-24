export interface PerfumeVariantDTO {
  id: string;
  perfumeId: string;
  volumeMl: number;
  priceCents: number;
  stock: number;
  sku: string;
}

export interface PerfumeWithVariants {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  olfactoryFamily: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  intensity: number;
  longevity: string;
  imageUrl: string;
  accentHex: string;
  labelStyle: string;
  ingredients: string;
  featured: boolean;
  variants: PerfumeVariantDTO[];
}

export interface CartItem {
  variantId: string;
  perfumeId: string;
  slug: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  volumeMl: number;
  priceCents: number;
  sku: string;
  quantity: number;
  maxStock: number;
}
