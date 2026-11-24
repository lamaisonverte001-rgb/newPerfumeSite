export interface PerfumeVariantDTO {
  id: string;
  perfumeId: string;
  volumeMl: number;
  priceCents: number;
  stock: number;
  sku: string;
}

export interface PerfumeDTO {
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
  accentColor: string;
  ingredients: string;
  featured: boolean;
  variants: PerfumeVariantDTO[];
}

export interface CartItem {
  variantId: string;
  perfumeId: string;
  slug: string;
  perfumeName: string;
  olfactoryFamily: string;
  volumeMl: number;
  priceCents: number;
  sku: string;
  imageUrl: string;
  maxStock: number;
  quantity: number;
}
