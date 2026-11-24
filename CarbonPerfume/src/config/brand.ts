export interface HeroBottleEdition {
  slug: string;
  name: string;
  labelTitleLines: string[];
  family: string;
  labelBg: string;
  labelText: string;
  labelBorder: string;
  liquidColor: string;
  liquidAttenuation: string;
  ambientGlow: string;
  fallbackImage: string;
}

export const BRAND_CONFIG = {
  name: "CARBON PERFUME",
  shortMonogram: "CP",
  atelierOrigin: "Grasse, Haute-Provence",
  tagline: "Haute Parfumerie d'Architecture & d'Émotion",
  logoUrl: "/images/logo/brand-logo.png",
  freeShippingThresholdCents: 12000, // 120,00 €
  standardShippingCents: 900, // 9,00 €
  complimentarySamplesCount: 2,
  contactEmail: "conciergerie@carbon-perfume.fr",
  address: "14 Rue du Faubourg Saint-Honoré, 75008 Paris",
  savoirFaire: [
    {
      title: "Composés à Grasse",
      description: "Assemblés et macérés 8 semaines dans nos chais historiques.",
    },
    {
      title: "Matières premières naturelles",
      description: "Absolus floraux, bois précieux et résines sourcés à l'origine.",
    },
    {
      title: "2 échantillons offerts",
      description: "Glissés délicatement dans chaque coffret pour prolonger la découverte.",
    },
    {
      title: "Livraison offerte dès 120 €",
      description: "Expédition soignée sous écrin scellé partout en Europe.",
    },
  ],
} as const;

export const OLFACTORY_FAMILIES = [
  "Tous",
  "Boisé",
  "Floral",
  "Ambré",
  "Hespéridé",
  "Épicé",
] as const;

export type OlfactoryFamilyFilter = (typeof OLFACTORY_FAMILIES)[number];

export const HERO_BOTTLE_EDITIONS: HeroBottleEdition[] = [
  {
    slug: "bois-altier",
    name: "Bois Altier",
    labelTitleLines: ["BOIS ALTIER"],
    family: "Boisé • Cèdre & Santal Sacré",
    labelBg: "#DCC084",
    labelText: "#1E1912",
    labelBorder: "#C89D46",
    liquidColor: "#E8CA7E",
    liquidAttenuation: "#D6AC52",
    ambientGlow: "#C8A464",
    fallbackImage: "/images/perfumes/bois-altier.png",
  },
  {
    slug: "aventus",
    name: "Aventus",
    labelTitleLines: ["AVENTUS"],
    family: "Boisé • Bergamote & Bouleau Fumé",
    labelBg: "#171717",
    labelText: "#DFC075",
    labelBorder: "#CFA855",
    liquidColor: "#E7CA82",
    liquidAttenuation: "#D4AF5A",
    ambientGlow: "#A68352",
    fallbackImage: "/images/perfumes/aventus.png",
  },
  {
    slug: "musc-ravageur",
    name: "Musc Ravageur",
    labelTitleLines: ["MUSC", "RAVAGEUR"],
    family: "Épicé • Cannelle & Ambre Charnel",
    labelBg: "#8D0D14",
    labelText: "#E5C67B",
    labelBorder: "#D2AB58",
    liquidColor: "#E5C374",
    liquidAttenuation: "#CC9D48",
    ambientGlow: "#9E3B3B",
    fallbackImage: "/images/perfumes/musc-ravageur.png",
  },
  {
    slug: "bianco-latte",
    name: "Bianco Latte",
    labelTitleLines: ["BIANCO", "LATTE"],
    family: "Ambré • Vanille Bourbon & Musc Lacté",
    labelBg: "#F3EDE2",
    labelText: "#161616",
    labelBorder: "#CCA555",
    liquidColor: "#EAD08C",
    liquidAttenuation: "#D8B668",
    ambientGlow: "#D5B88B",
    fallbackImage: "/images/perfumes/bianco-latte.png",
  },
  {
    slug: "bal-dafrique-absolu",
    name: "Bal d'Afrique Absolu",
    labelTitleLines: ["BAL D'AFRIQUE", "ABSOLU"],
    family: "Floral • Néroli Solaire & Vétiver Noir",
    labelBg: "#1A1918",
    labelText: "#DFBE74",
    labelBorder: "#CEA755",
    liquidColor: "#E7C87C",
    liquidAttenuation: "#D4AD56",
    ambientGlow: "#B68B4C",
    fallbackImage: "/images/perfumes/bal-dafrique-absolu.png",
  },
  {
    slug: "acqua-di-gio-profondo",
    name: "Acqua di Gio Profondo",
    labelTitleLines: ["ACQUA DI GIO", "PROFONDO"],
    family: "Hespéridé • Mandarine Verte & Cyprès",
    labelBg: "#0A515E",
    labelText: "#E2C478",
    labelBorder: "#CFA855",
    liquidColor: "#E8CD88",
    liquidAttenuation: "#D7B462",
    ambientGlow: "#2E7380",
    fallbackImage: "/images/perfumes/acqua-di-gio-profondo.png",
  },
];
