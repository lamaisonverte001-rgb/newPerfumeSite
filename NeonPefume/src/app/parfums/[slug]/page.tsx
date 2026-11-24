import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOtherPerfumes, getPerfumeBySlug } from "@/lib/catalog";
import { PerfumeDetailClient } from "@/components/product/PerfumeDetailClient";
import { PerfumeCard } from "@/components/collection/PerfumeCard";

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
    title: perfume.name,
    description: perfume.description,
  };
}

export default async function PerfumeDetailPage({ params }: PerfumePageProps) {
  const { slug } = await params;
  const [perfume, otherPerfumes] = await Promise.all([
    getPerfumeBySlug(slug),
    getOtherPerfumes(slug),
  ]);

  if (!perfume) {
    notFound();
  }

  return (
    <>
      <PerfumeDetailClient perfume={perfume} />

      {/* Explorer les autres créations */}
      <section className="border-t border-[#E5DFD5] bg-[#F2EDE6]/45 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
                Poursuivre la découverte
              </p>
              <h2 className="mt-2 font-serif text-3xl font-light text-[#161616] sm:text-4xl">
                Explorer les autres créations
              </h2>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {otherPerfumes.map((other, idx) => (
              <PerfumeCard key={other.id} perfume={other} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
