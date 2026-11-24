import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedPerfumeData {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  olfactoryFamily: "Boisé" | "Floral" | "Ambré" | "Hespéridé" | "Épicé";
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  intensity: number;
  longevity: string;
  imageUrl: string;
  accentColor: string;
  ingredients: string;
  featured: boolean;
  variants: {
    volumeMl: 50 | 100;
    priceCents: number;
    stock: number;
    sku: string;
  }[];
}

const PERFUMES_SEED: SeedPerfumeData[] = [
  {
    slug: "bois-altier",
    name: "Bois Altier",
    subtitle: "Extrait de Cèdre Atlas, Santal Sacré & Oud Blanc",
    description:
      "Une architecture boisée verticale et souveraine où la noblesse sèche du cèdre de l'Atlas rencontre l'onctuosité lactée du santal et le murmure minéral d'un oud blanc poli par le temps.",
    story:
      "Composé à l'aube dans nos chais de Grasse, Bois Altier rend hommage aux bibliothèques anciennes et aux futaies d'altitude baignées d'une lumière dorée. Après une envolée vibrante de cardamome verte et de poivre rose, le cœur déploie un accord sculptural d'iris pallida et de santal sacré, soutenu par une base profonde de vétiver fumé et d'ambre gris.",
    olfactoryFamily: "Boisé",
    topNotes: ["Cardamome verte du Guatemala", "Poivre rose", "Bergamote sèche"],
    heartNotes: ["Cèdre de l'Atlas", "Santal de Mysore", "Beurre d'Iris pallida"],
    baseNotes: ["Oud blanc fumé", "Vétiver d'Haïti", "Ambre gris minéral"],
    intensity: 5,
    longevity: "12h+ — Sillage architectural",
    imageUrl: "/images/perfumes/bois-altier.png",
    accentColor: "#B89454",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Farnesol, Coumarin, Citral, Eugenol, Isoeugenol. Macération 8 semaines — 28 % de concentration Parfum Intense.",
    featured: true,
    variants: [
      { volumeMl: 50, priceCents: 12500, stock: 24, sku: "CP-BOIS-050" },
      { volumeMl: 100, priceCents: 17500, stock: 16, sku: "CP-BOIS-100" },
    ],
  },
  {
    slug: "aventus",
    name: "Aventus",
    subtitle: "Chypre Impérial, Bergamote Calabre & Bouleau Fumé",
    description:
      "Un contraste saisissant entre l'éclat vif de la bergamote de Calabre et la profondeur racée du bouleau fumé, posé sur un lit de mousse de chêne et d'ambroxan cristallin.",
    story:
      "Taillé dans le clair-obscur, cet extrait chypré conjugue tension lumineuse et charisme magnétique. Les fruits noirs et l'écorce de bergamote pressée à froid ouvrent la voie à un cœur sec d'écorce de bouleau goudronnée et de baies de genièvre, avant de se fondre sur la peau dans une empreinte boisée-musquée d'une tenue remarquable.",
    olfactoryFamily: "Boisé",
    topNotes: ["Bergamote de Calabre", "Cassis noir de Bourgogne", "Ananas rôti"],
    heartNotes: ["Écorce de bouleau fumé", "Baies de genièvre", "Jasmin d'Égypte"],
    baseNotes: ["Mousse de chêne", "Ambroxan cristallin", "Cèdre sec", "Musc impérial"],
    intensity: 5,
    longevity: "12h+ — Sillage magnétique",
    imageUrl: "/images/perfumes/aventus.png",
    accentColor: "#8C734B",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Citral, Evernia Prunastri (Oakmoss) Extract, Geraniol. Macération 8 semaines — 28 % de concentration Parfum Intense.",
    featured: true,
    variants: [
      { volumeMl: 50, priceCents: 13500, stock: 20, sku: "CP-AVEN-050" },
      { volumeMl: 100, priceCents: 18500, stock: 12, sku: "CP-AVEN-100" },
    ],
  },
  {
    slug: "bal-dafrique-absolu",
    name: "Bal d'Afrique Absolu",
    subtitle: "Néroli Solaire, Souci Velouté & Vétiver Noir",
    description:
      "Un bouquet radieux et vibrant où la fleur d'oranger d'Afrique et la violette poudrée dansent sur la chaleur terreuse et sophistiquée d'un vétiver noir infusé d'ambre.",
    story:
      "Ode au voyage immobile et à l'effervescence artistique des nuits chaudes, Bal d'Afrique Absolu capture l'instant précis où le soleil décline en or liquide. La fraîcheur aromatique du citron d'Amalfi et du buchu laisse éclore un cœur floral texturé de jasmin et de violette, ancré par le cèdre du Maroc et un vétiver sombre au velouté hypnotique.",
    olfactoryFamily: "Floral",
    topNotes: ["Fleur d'oranger d'Afrique", "Souci solaire", "Citron d'Amalfi"],
    heartNotes: ["Violette poudrée", "Pétales de jasmin", "Cyclamen sauvage"],
    baseNotes: ["Vétiver noir", "Cèdre du Maroc", "Ambre chaud", "Musc velours"],
    intensity: 4,
    longevity: "10h — Sillage lumineux & enveloppant",
    imageUrl: "/images/perfumes/bal-dafrique-absolu.png",
    accentColor: "#B68B4C",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Alpha-Isomethyl Ionone, Linalool, Hydroxycitronellal, Citral, Coumarin, Geraniol. Macération 6 semaines — 25 % de concentration Parfum Intense.",
    featured: true,
    variants: [
      { volumeMl: 50, priceCents: 12000, stock: 28, sku: "CP-BALA-050" },
      { volumeMl: 100, priceCents: 17000, stock: 18, sku: "CP-BALA-100" },
    ],
  },
  {
    slug: "bianco-latte",
    name: "Bianco Latte",
    subtitle: "Élixir Ambré, Vanille de Madagascar & Musc Lacté",
    description:
      "Une caresse olfactive d'ivoire et de soie : la douceur dorée du miel blanc et de la coumarine fond dans un absolu de gousse de vanille noire et un nuage de muscs lactés.",
    story:
      "Pensé comme un cachemire blanc posé à même la peau, Bianco Latte explore la gourmandise sous un prisme haute couture, jamais saturé, infiniment texturé. L'accord d'ouverture mêle caramel blond délicat et fleur d'amandier, ouvrant sur un cœur baumé d'héliotrope et de miel de Provence, scellé par le benjoin du Siam et l'absolu de vanille Bourbon.",
    olfactoryFamily: "Ambré",
    topNotes: ["Caramel blond délicat", "Amande douce", "Fleur de lait"],
    heartNotes: ["Miel blanc de Provence", "Coumarine", "Héliotrope poudré"],
    baseNotes: ["Absolu Vanille de Madagascar", "Musc blanc lacté", "Benjoin du Siam"],
    intensity: 4,
    longevity: "11h — Sillage seconde peau",
    imageUrl: "/images/perfumes/bianco-latte.png",
    accentColor: "#C4A478",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Coumarin, Benzyl Benzoate, Vanillin, Benzyl Cinnamate, Linalool. Macération 7 semaines — 26 % de concentration Parfum Intense.",
    featured: false,
    variants: [
      { volumeMl: 50, priceCents: 11000, stock: 32, sku: "CP-BIAN-050" },
      { volumeMl: 100, priceCents: 15500, stock: 22, sku: "CP-BIAN-100" },
    ],
  },
  {
    slug: "musc-ravageur",
    name: "Musc Ravageur",
    subtitle: "Cannelle de Ceylan, Ambre Incandescent & Musc Charnel",
    description:
      "Un oriental épicé sans compromis, dénué de toute note florale superflue : l'ardeur de la cannelle et du girofle embrase un accord charnel d'ambre, de fève tonka et de muscs profonds.",
    story:
      "Manifeste d'audace et de sensualité pure, Musc Ravageur s'ouvre sur un frisson sec de bergamote et de lavande fine de Haute-Provence avant de révéler son cœur incandescent d'écorce de cannelle de Ceylan. Sur la peau, le parfum s'arrondit pendant des heures en un velours rougeoyant de bois de gaïac, de vanille sombre et de muscs ambrés.",
    olfactoryFamily: "Épicé",
    topNotes: ["Bergamote vive", "Mandarine rouge", "Lavande de Haute-Provence"],
    heartNotes: ["Cannelle de Ceylan", "Clou de girofle", "Cèdre ambré"],
    baseNotes: ["Musc charnel", "Ambre résineux", "Fève tonka torréfiée", "Bois de gaïac"],
    intensity: 5,
    longevity: "14h — Sillage incandescent",
    imageUrl: "/images/perfumes/musc-ravageur.png",
    accentColor: "#8B1E24",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Eugenol, Cinnamal, Citral, Geraniol, Citronellol. Macération 8 semaines — 30 % de concentration Parfum Intense.",
    featured: true,
    variants: [
      { volumeMl: 50, priceCents: 13000, stock: 19, sku: "CP-MUSC-050" },
      { volumeMl: 100, priceCents: 18000, stock: 14, sku: "CP-MUSC-100" },
    ],
  },
  {
    slug: "acqua-di-gio-profondo",
    name: "Acqua di Gio Profondo",
    subtitle: "Mandarine Verte, Accord Minéral Marin & Cyprès",
    description:
      "Une plongée minérale et lumineuse où le zeste incisif de la mandarine verte d'Italie rencontre les herbes aromatiques côtières et la profondeur saline d'un patchouli ambré.",
    story:
      "Inspiré des falaises calcaires plongeant dans une Méditerranée d'encre bleue au lever du jour, Profondo réinvente la fraîcheur hespéridée avec une densité noble. La mandarine verte récoltée à la main fusionne avec le romarin sauvage, le lentisque et le cyprès de Toscane, laissant un sillage minéral, pur et résolument contemporain.",
    olfactoryFamily: "Hespéridé",
    topNotes: ["Mandarine verte d'Italie", "Bergamote vive", "Embruns minéraux"],
    heartNotes: ["Romarin sauvage", "Cyprès de Toscane", "Absolu de lentisque"],
    baseNotes: ["Patchouli du Guatemala", "Ambre minéral salin", "Musc cristallin"],
    intensity: 3,
    longevity: "8h — Sillage frais & minéral",
    imageUrl: "/images/perfumes/acqua-di-gio-profondo.png",
    accentColor: "#175866",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Benzyl Salicylate, Citronellol, Alpha-Isomethyl Ionone, Citral, Geraniol. Macération 6 semaines — 24 % de concentration Parfum Intense.",
    featured: false,
    variants: [
      { volumeMl: 50, priceCents: 9500, stock: 35, sku: "CP-PROF-050" },
      { volumeMl: 100, priceCents: 14000, stock: 25, sku: "CP-PROF-100" },
    ],
  },
];

async function main() {
  console.log("🌿 Démarrage du seed idempotent CARBON PERFUME...");

  for (const item of PERFUMES_SEED) {
    const perfume = await prisma.perfume.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        subtitle: item.subtitle,
        description: item.description,
        story: item.story,
        olfactoryFamily: item.olfactoryFamily,
        topNotes: item.topNotes,
        heartNotes: item.heartNotes,
        baseNotes: item.baseNotes,
        intensity: item.intensity,
        longevity: item.longevity,
        imageUrl: item.imageUrl,
        accentColor: item.accentColor,
        ingredients: item.ingredients,
        featured: item.featured,
      },
      create: {
        slug: item.slug,
        name: item.name,
        subtitle: item.subtitle,
        description: item.description,
        story: item.story,
        olfactoryFamily: item.olfactoryFamily,
        topNotes: item.topNotes,
        heartNotes: item.heartNotes,
        baseNotes: item.baseNotes,
        intensity: item.intensity,
        longevity: item.longevity,
        imageUrl: item.imageUrl,
        accentColor: item.accentColor,
        ingredients: item.ingredients,
        featured: item.featured,
      },
    });

    for (const variant of item.variants) {
      await prisma.perfumeVariant.upsert({
        where: { sku: variant.sku },
        update: {
          perfumeId: perfume.id,
          volumeMl: variant.volumeMl,
          priceCents: variant.priceCents,
        },
        create: {
          perfumeId: perfume.id,
          volumeMl: variant.volumeMl,
          priceCents: variant.priceCents,
          stock: variant.stock,
          sku: variant.sku,
        },
      });
    }

    console.log(`  ✓ ${perfume.name} (${perfume.olfactoryFamily}) synchronisé`);
  }

  console.log("✨ Catalogue CARBON PERFUME initialisé avec succès.");
}

main()
  .catch((error: unknown) => {
    console.error("❌ Erreur lors du seed Prisma :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
