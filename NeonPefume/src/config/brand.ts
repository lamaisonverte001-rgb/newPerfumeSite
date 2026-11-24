/**
 * Configuration centralisée de la Maison de Parfumerie.
 * Modifiez `BRAND_CONFIG.name` (par ex. « MAISON SILLAGE ») ou `monogram`
 * pour adapter instantanément toute la boutique et la scène 3D.
 */
export const BRAND_CONFIG = {
  name: "LA MAISON VERTE",
  monogram: "LMV",
  tagline: "Haute Parfumerie Contemporaine",
  subtitle: "Extraits & Parfums Intenses composés à Grasse",
  logoPath: "/images/brand/logo-lmv.png",
  atelierLocation: "Grasse & Paris",
  originLabel: "MADE IN EUROPE",
  contactEmail: "conciergerie@lamaisonverte.fr",
  contactPhone: "+33 (0)1 42 68 54 00",
  address: "18 Rue Saint-Honoré, 75001 Paris",
  freeShippingThresholdCents: 12000, // 120 €
  standardShippingCents: 900, // 9 €
  currency: "EUR" as const,
  locale: "fr-FR" as const,
} as const;
