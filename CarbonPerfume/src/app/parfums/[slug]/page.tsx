import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerfumeBySlug, getOtherPerfumes } from "@/lib/queries";
import { PerfumeDetailClient } from "@/components/perfume/perfume-detail-client";
import { PerfumeCard } from "@/components/perfume/perfume-card";

export const dynamic = "force-dynamic";

interface PerfumePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PerfumePageProps): Promise<Metadata> {
  const { slug } = await params;
  const perfume = await getPerfumeBySlug(slug);

  if (!perfume) {
    return { title: "Création introuvable" };
  }

  return {
    title: `${perfume.name} — Parfum Intense`,
    description: perfume.description,
  };
}

export default async function PerfumeDetailPage({ params }: PerfumePageProps) {
  const { slug } = await params;
  const perfume = await getPerfumeBySlug(slug);

  if (!perfume) {
    notFound();
  }

  const otherPerfumes = await getOtherPerfumes(slug);

  return (
    <div className="bg-[#FAF8F5]">
      <PerfumeDetailClient perfume={perfume} />

      {/* Explore Other Creations */}
      <section className="border-t border-[#E5DFD5] bg-[#F2EDE6]/45 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#A68352]">
                La Collection
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#161616] sm:text-4xl">
                Explorer les autres créations
              </h2>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {otherPerfumes.slice(0, 3).map((other) => (
              <PerfumeCard key={other.id} perfume={other} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
