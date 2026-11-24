import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedVariant {
  volumeMl: number;
  priceCents: number;
  stock: number;
  sku: string;
}

interface SeedPerfume {
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
  accentHex: string;
  labelStyle: "obsidian" | "ivory" | "gold" | "crimson" | "teal";
  ingredients: string;
  featured: boolean;
  variants: SeedVariant[];
}

const PERFUMES: SeedPerfume[] = [
  {
    slug: "aventus",
    name: "Aventus",
    subtitle: "Chypré Boisé Fumé — Parfum Intense",
    description:
      "Une ouverture vibrante de bergamote de Calabre et d'ananas mûr, sculptée par la noblesse fumée du bouleau blanc et la profondeur minérale de l'ambre gris.",
    story:
      "Conçu comme une ode à l'audace contemporaine, Aventus marie la fraîcheur cristalline des agrumes italiens à une macération lente d'essences de bouleau fumé et de mousse de chêne. Son flacon habillé d'un médaillon obsidienne bordé d'or incarne la maîtrise architecturale de nos ateliers grassois.",
    olfactoryFamily: "Boisé",
    topNotes: ["Bergamote de Calabre", "Ananas rôti", "Cassis noir", "Pomme croquante"],
    heartNotes: ["Bouleau fumé", "Jasmin du Maroc", "Patchouli d'Indonésie", "Baies de genièvre"],
    baseNotes: ["Mousse de chêne", "Ambre gris", "Musc blanc", "Vanille sèche"],
    intensity: 5,
    longevity: "12+ heures",
    imageUrl: "/images/perfumes/aventus.png",
    accentHex: "#24221F",
    labelStyle: "obsidian",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citral, Coumarin, Evernia Prunastri (Oakmoss) Extract, Citronellol, Geraniol.",
    featured: true,
    variants: [
      { volumeMl: 50, priceCents: 12500, stock: 24, sku: "LMV-AVE-050" },
      { volumeMl: 100, priceCents: 18500, stock: 16, sku: "LMV-AVE-100" },
    ],
  },
  {
    slug: "bois-altier",
    name: "Bois Altier",
    subtitle: "Boisé Résineux Noble — Parfum Intense",
    description:
      "Un cèdre de l'Atlas majestueux illuminé par la cardamome verte et l'encens sacré, reposant sur un santal crémeux d'une élégance souveraine.",
    story:
      "Inspiré par la quiétude des forêts d'altitude au lever du jour, Bois Altier célèbre les essences ligneuses dans leur expression la plus pure. Distillé à la vapeur douce puis vieilli six semaines en cuve de verre, il révèle un sillage doré, sec et lumineux, à l'image de son étiquette or brossé.",
    olfactoryFamily: "Boisé",
    topNotes: ["Cardamome verte", "Baies de genièvre", "Zeste de bergamote", "Poivre de Timut"],
    heartNotes: ["Cèdre de l'Atlas", "Encens oliban", "Vétiver de Java", "Iris pallida"],
    baseNotes: ["Santal de Mysore", "Ambre sec", "Labdanum", "Cachemire boisé"],
    intensity: 4,
    longevity: "10–12 heures",
    imageUrl: "/images/perfumes/bois-altier.png",
    accentHex: "#C5A25D",
    labelStyle: "gold",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Farnesol, Eugenol, Isoeugenol, Citral, Coumarin.",
    featured: true,
    variants: [
      { volumeMl: 50, priceCents: 11500, stock: 20, sku: "LMV-BAL-050" },
      { volumeMl: 100, priceCents: 17000, stock: 14, sku: "LMV-BAL-100" },
    ],
  },
  {
    slug: "bal-dafrique-absolu",
    name: "Bal d'Afrique Absolu",
    subtitle: "Floral Boisé Solaire — Parfum Intense",
    description:
      "Un éclat de tagète africaine et de citron d'Amalfi qui s'épanouit sur un cœur de violette poudrée, adouci par le vétiver noir et l'ambre doré.",
    story:
      "Hommage à l'effervescence artistique du Paris des années 1920 et à la chaleur lumineuse du continent africain, cette version Absolu concentre les absolues florales jusqu'à l'incandescence. Un parfum de contraste, à la fois radieux, velouté et profondément addictif.",
    olfactoryFamily: "Floral",
    topNotes: ["Citron d'Amalfi", "Tagète africaine", "Bergamote", "Néroli d'oranger"],
    heartNotes: ["Violette poudrée", "Jasmin de nuit", "Cyclamen", "Pétales de bucchu"],
    baseNotes: ["Vétiver noir", "Bois de cèdre marocain", "Ambre chaud", "Musc soyeux"],
    intensity: 4,
    longevity: "10–12 heures",
    imageUrl: "/images/perfumes/bal-dafrique-absolu.png",
    accentHex: "#8C6D46",
    labelStyle: "obsidian",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Alpha-Isomethyl Ionone, Linalool, Citral, Coumarin, Hydroxycitronellal.",
    featured: true,
    variants: [
      { volumeMl: 50, priceCents: 12000, stock: 18, sku: "LMV-BDA-050" },
      { volumeMl: 100, priceCents: 17500, stock: 12, sku: "LMV-BDA-100" },
    ],
  },
  {
    slug: "bianco-latte",
    name: "Bianco Latte",
    subtitle: "Ambré Gourmand Lacté — Parfum Intense",
    description:
      "Une caresse enveloppante de caramel doré, de miel blanc et de vanille de Madagascar, sublimée par la coumarine et un musc lacté d'une douceur irrésistible.",
    story:
      "Vêtu de son médaillon papier ivoire grainé, Bianco Latte explore la sensualité tactile des matières réconfortantes sans jamais renoncer à la légèreté. Les gousses de vanille bourbon infusées lentement se fondent dans un accord lacté soyeux qui épouse la peau comme un cachemire chaud.",
    olfactoryFamily: "Ambré",
    topNotes: ["Caramel doré", "Accord crème de lait", "Fleur d'amandier"],
    heartNotes: ["Miel blanc de Provence", "Coumarine", "Fève tonka torréfiée"],
    baseNotes: ["Vanille de Madagascar", "Musc blanc velouté", "Bois de santal lacté"],
    intensity: 5,
    longevity: "12+ heures",
    imageUrl: "/images/perfumes/bianco-latte.png",
    accentHex: "#B89B72",
    labelStyle: "ivory",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Coumarin, Benzyl Benzoate, Anise Alcohol, Benzyl Alcohol, Limonene.",
    featured: true,
    variants: [
      { volumeMl: 50, priceCents: 10500, stock: 30, sku: "LMV-BLA-050" },
      { volumeMl: 100, priceCents: 15500, stock: 22, sku: "LMV-BLA-100" },
    ],
  },
  {
    slug: "musc-ravageur",
    name: "Musc Ravageur",
    subtitle: "Oriental Épicé Magnétique — Parfum Intense",
    description:
      "Un incendie feutré de cannelle de Ceylan et de clou de girofle tempéré par la lavande, plongeant dans un sillage ambré-vanillé d'une sensualité incandescente.",
    story:
      "Signé d'un médaillon carmin profond, Musc Ravageur ose la tension entre fraîcheur aromatique et épices brûlantes. Une création dramatique et raffinée, pensée pour les nuits d'hiver et les présences inoubliables où chaque note se déploie lentement sur la peau.",
    olfactoryFamily: "Épicé",
    topNotes: ["Lavande fine", "Mandarine jaune", "Bergamote zestée"],
    heartNotes: ["Cannelle de Ceylan", "Clou de girofle", "Poivre rose", "Noix de muscade"],
    baseNotes: ["Musc ambré", "Vanille bourbon", "Bois de gaïac", "Fève tonka", "Santal"],
    intensity: 5,
    longevity: "12+ heures",
    imageUrl: "/images/perfumes/musc-ravageur.png",
    accentHex: "#9B1B1B",
    labelStyle: "crimson",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Eugenol, Linalool, Limonene, Coumarin, Cinnamal, Geraniol, Citral, Benzyl Benzoate.",
    featured: true,
    variants: [
      { volumeMl: 50, priceCents: 11800, stock: 15, sku: "LMV-MRA-050" },
      { volumeMl: 100, priceCents: 17800, stock: 10, sku: "LMV-MRA-100" },
    ],
  },
  {
    slug: "acqua-di-gio-profondo",
    name: "Acqua di Gio Profondo",
    subtitle: "Hespéridé Marin Minéral — Parfum Intense",
    description:
      "Un plongeon cristallin où la mandarine verte et les embruns marins rencontrent le romarin méditerranéen, ancrés dans un patchouli minéral profond.",
    story:
      "Capturant les nuances bleu abysse de la Méditerranée à l'aube, son étiquette bleu pétrole évoque le silence minéral des criques escarpées. Une fraîcheur aromatique d'une tenue remarquable, où les essences d'agrumes pressés à froid rencontrent la résine de lentisque et l'ambre minéral.",
    olfactoryFamily: "Hespéridé",
    topNotes: ["Mandarine verte", "Bergamote de Calabre", "Accords marins salins"],
    heartNotes: ["Romarin sauvage", "Lavande de Provence", "Cyprès bleu", "Lentisque"],
    baseNotes: ["Patchouli minéral", "Ambre minéral", "Musc marin", "Bois flotté"],
    intensity: 3,
    longevity: "8–10 heures",
    imageUrl: "/images/perfumes/acqua-di-gio-profondo.png",
    accentHex: "#005B63",
    labelStyle: "teal",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Alpha-Isomethyl Ionone, Citronellol, Benzyl Salicylate, Geraniol, Citral.",
    featured: false,
    variants: [
      { volumeMl: 50, priceCents: 9500, stock: 26, sku: "LMV-AGP-050" },
      { volumeMl: 100, priceCents: 14500, stock: 19, sku: "LMV-AGP-100" },
    ],
  },
];

async function main() {
  console.log("Seeding LA MAISON VERTE catalogue...");

  for (const perfumeData of PERFUMES) {
    const { variants, ...perfumeFields } = perfumeData;

    const perfume = await prisma.perfume.upsert({
      where: { slug: perfumeFields.slug },
      update: perfumeFields,
      create: perfumeFields,
    });

    for (const variant of variants) {
      await prisma.perfumeVariant.upsert({
        where: { sku: variant.sku },
        update: {
          volumeMl: variant.volumeMl,
          priceCents: variant.priceCents,
          stock: variant.stock,
          perfumeId: perfume.id,
        },
        create: {
          ...variant,
          perfumeId: perfume.id,
        },
      });
    }

    console.log(`  ✓ ${perfume.name} (${variants.length} variantes)`);
  }

  console.log("Seed terminé avec succès.");
}

main()
  .catch((error) => {
    console.error("Erreur lors du seed :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
