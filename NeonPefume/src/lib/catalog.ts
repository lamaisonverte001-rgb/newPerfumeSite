import { prisma } from "@/lib/prisma";
import type { PerfumeWithVariants } from "@/types/perfume";

export async function getAllPerfumes(): Promise<PerfumeWithVariants[]> {
  const perfumes = await prisma.perfume.findMany({
    include: {
      variants: {
        orderBy: { volumeMl: "asc" },
      },
    },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  return perfumes;
}

export async function getPerfumeBySlug(
  slug: string
): Promise<PerfumeWithVariants | null> {
  const perfume = await prisma.perfume.findUnique({
    where: { slug },
    include: {
      variants: {
        orderBy: { volumeMl: "asc" },
      },
    },
  });

  return perfume;
}

export async function getOtherPerfumes(
  excludeSlug: string
): Promise<PerfumeWithVariants[]> {
  const perfumes = await prisma.perfume.findMany({
    where: { slug: { not: excludeSlug } },
    include: {
      variants: {
        orderBy: { volumeMl: "asc" },
      },
    },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  return perfumes;
}
