import { prisma } from "@/lib/prisma";
import type { PerfumeDTO } from "@/types/perfume";

export async function getAllPerfumes(): Promise<PerfumeDTO[]> {
  const perfumes = await prisma.perfume.findMany({
    include: {
      variants: {
        orderBy: { volumeMl: "asc" },
      },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });

  return perfumes.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    description: p.description,
    story: p.story,
    olfactoryFamily: p.olfactoryFamily,
    topNotes: p.topNotes,
    heartNotes: p.heartNotes,
    baseNotes: p.baseNotes,
    intensity: p.intensity,
    longevity: p.longevity,
    imageUrl: p.imageUrl,
    accentColor: p.accentColor,
    ingredients: p.ingredients,
    featured: p.featured,
    variants: p.variants.map((v) => ({
      id: v.id,
      perfumeId: v.perfumeId,
      volumeMl: v.volumeMl,
      priceCents: v.priceCents,
      stock: v.stock,
      sku: v.sku,
    })),
  }));
}

export async function getPerfumeBySlug(slug: string): Promise<PerfumeDTO | null> {
  const p = await prisma.perfume.findUnique({
    where: { slug },
    include: {
      variants: {
        orderBy: { volumeMl: "asc" },
      },
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    description: p.description,
    story: p.story,
    olfactoryFamily: p.olfactoryFamily,
    topNotes: p.topNotes,
    heartNotes: p.heartNotes,
    baseNotes: p.baseNotes,
    intensity: p.intensity,
    longevity: p.longevity,
    imageUrl: p.imageUrl,
    accentColor: p.accentColor,
    ingredients: p.ingredients,
    featured: p.featured,
    variants: p.variants.map((v) => ({
      id: v.id,
      perfumeId: v.perfumeId,
      volumeMl: v.volumeMl,
      priceCents: v.priceCents,
      stock: v.stock,
      sku: v.sku,
    })),
  };
}

export async function getOtherPerfumes(excludeSlug: string): Promise<PerfumeDTO[]> {
  const all = await getAllPerfumes();
  return all.filter((p) => p.slug !== excludeSlug);
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          variant: {
            include: {
              perfume: {
                select: {
                  slug: true,
                  imageUrl: true,
                  olfactoryFamily: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
