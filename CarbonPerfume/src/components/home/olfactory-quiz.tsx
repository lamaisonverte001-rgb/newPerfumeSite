"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { PerfumeDTO } from "@/types/perfume";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  id: string;
  stepLabel: string;
  question: string;
  options: {
    id: string;
    title: string;
    subtitle: string;
    targetFamilies: string[];
    preferredSlugs: string[];
    minIntensity: number;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "atmosphere",
    stepLabel: "Question I sur III — L'Atmosphère",
    question: "Quel univers sensible évoque le mieux votre allure ?",
    options: [
      {
        id: "architectural-wood",
        title: "Bibliothèque de cèdre & pierre chaude",
        subtitle: "Souverain, feutré, sculpté dans les bois précieux",
        targetFamilies: ["Boisé"],
        preferredSlugs: ["bois-altier", "aventus"],
        minIntensity: 5,
      },
      {
        id: "solar-neroli",
        title: "Jardin solaire au crépuscule",
        subtitle: "Lumineux, floral texturé et vétiver vibrant",
        targetFamilies: ["Floral"],
        preferredSlugs: ["bal-dafrique-absolu"],
        minIntensity: 4,
      },
      {
        id: "velvet-amber",
        title: "Cachemire ivoire & douceur lactée",
        subtitle: "Enveloppant, vanille noire et muscs blancs",
        targetFamilies: ["Ambré"],
        preferredSlugs: ["bianco-latte"],
        minIntensity: 4,
      },
      {
        id: "incandescent-spice",
        title: "Velours carmin & épices ardentes",
        subtitle: "Magnétique, charnel, ambre et cannelle de Ceylan",
        targetFamilies: ["Épicé"],
        preferredSlugs: ["musc-ravageur"],
        minIntensity: 5,
      },
      {
        id: "mineral-sea",
        title: "Falaise calcaire & embruns d'aube",
        subtitle: "Minéral, mandarine verte et cyprès aromatique",
        targetFamilies: ["Hespéridé"],
        preferredSlugs: ["acqua-di-gio-profondo"],
        minIntensity: 3,
      },
    ],
  },
  {
    id: "moment",
    stepLabel: "Question II sur III — L'Instant",
    question: "À quel moment souhaitez-vous faire rayonner ce parfum ?",
    options: [
      {
        id: "daylight",
        title: "Dès les premières heures du matin",
        subtitle: "Clarté vive, fraîcheur ciselée et élégance naturelle",
        targetFamilies: ["Hespéridé", "Floral"],
        preferredSlugs: ["acqua-di-gio-profondo", "bal-dafrique-absolu"],
        minIntensity: 3,
      },
      {
        id: "signature-daily",
        title: "Comme une signature quotidienne",
        subtitle: "Présence affirmée du matin jusqu'au soir",
        targetFamilies: ["Boisé", "Ambré"],
        preferredSlugs: ["aventus", "bois-altier", "bianco-latte"],
        minIntensity: 4,
      },
      {
        id: "evening",
        title: "À la tombée de la nuit & grands soirs",
        subtitle: "Profondeur enveloppante, mystère et sillage mémorable",
        targetFamilies: ["Épicé", "Boisé", "Ambré"],
        preferredSlugs: ["musc-ravageur", "bois-altier"],
        minIntensity: 5,
      },
    ],
  },
  {
    id: "intensity",
    stepLabel: "Question III sur III — L'Empreinte",
    question: "Quelle intensité olfactive recherchez-vous sur la peau ?",
    options: [
      {
        id: "intimate",
        title: "Murmure minéral & seconde peau",
        subtitle: "Un halo délicat que l'on découvre en s'approchant",
        targetFamilies: ["Hespéridé", "Ambré"],
        preferredSlugs: ["acqua-di-gio-profondo", "bianco-latte"],
        minIntensity: 3,
      },
      {
        id: "balanced",
        title: "Sillage radieux & équilibré",
        subtitle: "Une diffusion harmonieuse et solaire toute la journée",
        targetFamilies: ["Floral", "Ambré"],
        preferredSlugs: ["bal-dafrique-absolu", "bianco-latte"],
        minIntensity: 4,
      },
      {
        id: "intense",
        title: "Extrait souverain haute tenue",
        subtitle: "Une signature puissante qui traverse la nuit (12h+)",
        targetFamilies: ["Boisé", "Épicé"],
        preferredSlugs: ["bois-altier", "musc-ravageur", "aventus"],
        minIntensity: 5,
      },
    ],
  },
];

export function OlfactoryQuizSection({ perfumes }: { perfumes: PerfumeDTO[] }) {
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedVolume, setSelectedVolume] = useState<number>(50);

  const addItem = useCartStore((s) => s.addItem);

  const isCompleted = answers.length === QUIZ_QUESTIONS.length;

  const recommendedPerfume = useMemo<PerfumeDTO | null>(() => {
    if (!isCompleted || perfumes.length === 0) return null;

    const scores = new Map<string, number>();
    for (const p of perfumes) {
      scores.set(p.slug, 0);
    }

    answers.forEach((answerId, qIndex) => {
      const question = QUIZ_QUESTIONS[qIndex];
      const chosen = question?.options.find((opt) => opt.id === answerId);
      if (!chosen) return;

      // Weight question 1 highest for olfactory family fidelity
      const weight = qIndex === 0 ? 4 : 2;

      for (const p of perfumes) {
        let delta = 0;
        if (chosen.targetFamilies.includes(p.olfactoryFamily)) {
          delta += 3 * weight;
        }
        const slugRank = chosen.preferredSlugs.indexOf(p.slug);
        if (slugRank !== -1) {
          delta += (4 - slugRank) * weight;
        }
        if (Math.abs(p.intensity - chosen.minIntensity) === 0) {
          delta += 2;
        }
        scores.set(p.slug, (scores.get(p.slug) ?? 0) + delta);
      }
    });

    let best = perfumes[0];
    let bestScore = -1;
    for (const p of perfumes) {
      const s = scores.get(p.slug) ?? 0;
      if (s > bestScore) {
        bestScore = s;
        best = p;
      }
    }
    return best;
  }, [answers, isCompleted, perfumes]);

  const handleSelectOption = (optionId: string) => {
    const nextAnswers = [...answers.slice(0, step), optionId];
    setAnswers(nextAnswers);
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleReset = () => {
    setAnswers([]);
    setStep(0);
    setSelectedVolume(50);
  };

  const currentQuestion = QUIZ_QUESTIONS[step];
  const recommendedVariant =
    recommendedPerfume?.variants.find((v) => v.volumeMl === selectedVolume) ??
    recommendedPerfume?.variants[0];

  const handleAddRecommended = () => {
    if (!recommendedPerfume || !recommendedVariant || recommendedVariant.stock <= 0) {
      return;
    }
    addItem(
      {
        variantId: recommendedVariant.id,
        perfumeId: recommendedPerfume.id,
        slug: recommendedPerfume.slug,
        perfumeName: recommendedPerfume.name,
        olfactoryFamily: recommendedPerfume.olfactoryFamily,
        volumeMl: recommendedVariant.volumeMl,
        priceCents: recommendedVariant.priceCents,
        sku: recommendedVariant.sku,
        imageUrl: recommendedPerfume.imageUrl,
        maxStock: recommendedVariant.stock,
      },
      1,
      true
    );
    toast.success(
      `${recommendedPerfume.name} (${recommendedVariant.volumeMl} ml) ajouté à votre écrin.`
    );
  };

  return (
    <section
      id="diagnostic"
      className="scroll-mt-20 bg-[#FAF8F5] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#A68352]">
            Consultation Privée
          </p>
          <h2 className="mt-3 font-serif text-4xl font-normal text-[#161616] sm:text-5xl">
            Trouvez votre signature olfactive
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#6B655E]">
            Trois nuances suffisent à notre maître parfumeur pour révéler l&apos;extrait qui épousera naturellement votre peau.
          </p>
        </div>

        <div className="mt-12 border border-[#E5DFD5] bg-[#F2EDE6]/55 p-6 sm:p-10 lg:p-12">
          <AnimatePresence mode="wait">
            {!isCompleted && currentQuestion ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.32 }}
              >
                {/* Progress Header */}
                <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-5">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-[#A68352]">
                    {currentQuestion.stepLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    {QUIZ_QUESTIONS.map((q, i) => (
                      <span
                        key={q.id}
                        className={cn(
                          "h-1.5 w-8 transition-colors",
                          i <= step ? "bg-[#A68352]" : "bg-[#E5DFD5]"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="mt-7 font-serif text-2xl text-[#161616] sm:text-3xl">
                  {currentQuestion.question}
                </h3>

                <div className="mt-7 grid gap-3.5 sm:grid-cols-2">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className="group flex flex-col justify-between border border-[#E5DFD5] bg-[#FAF8F5] p-5 text-left transition-all duration-300 hover:border-[#A68352] hover:bg-[#FFFDF9] cursor-pointer"
                    >
                      <div>
                        <p className="font-serif text-xl text-[#161616] transition-colors group-hover:text-[#A68352]">
                          {opt.title}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#6B655E]">
                          {opt.subtitle}
                        </p>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#A68352]">
                        Choisir
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </button>
                  ))}
                </div>

                {step > 0 && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(step - 1);
                        setAnswers((prev) => prev.slice(0, step - 1));
                      }}
                      className="text-xs uppercase tracking-[0.18em] text-[#6B655E] hover:text-[#161616] cursor-pointer"
                    >
                      ← Question précédente
                    </button>
                  </div>
                )}
              </motion.div>
            ) : recommendedPerfume ? (
              <motion.div
                key="quiz-result"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="grid items-center gap-8 lg:grid-cols-12"
              >
                <div className="relative aspect-[4/5] w-full border border-[#E5DFD5] bg-[#FAF8F5] p-8 lg:col-span-5">
                  <Image
                    src={recommendedPerfume.imageUrl}
                    alt={recommendedPerfume.name}
                    fill
                    sizes="(max-width: 1024px) 80vw, 360px"
                    className="object-contain p-6"
                  />
                </div>

                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#A68352]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Votre Affinité Olfactive • {recommendedPerfume.olfactoryFamily}</span>
                  </div>

                  <h3 className="mt-3 font-serif text-4xl text-[#161616]">
                    {recommendedPerfume.name}
                  </h3>
                  <p className="mt-1 font-serif text-lg italic text-[#6B655E]">
                    {recommendedPerfume.subtitle}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-[#6B655E]">
                    {recommendedPerfume.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      ...recommendedPerfume.topNotes.slice(0, 1),
                      ...recommendedPerfume.heartNotes.slice(0, 1),
                      ...recommendedPerfume.baseNotes.slice(0, 2),
                    ].map((note) => (
                      <span
                        key={note}
                        className="border border-[#E5DFD5] bg-[#FAF8F5] px-3 py-1 text-xs text-[#161616]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Format selector + Price */}
                  <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#E5DFD5] pt-6">
                    <div className="inline-flex border border-[#E5DFD5] bg-[#FAF8F5] p-0.5">
                      {recommendedPerfume.variants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVolume(v.volumeMl)}
                          className={cn(
                            "px-4 py-1.5 text-xs font-medium tracking-wider transition-all cursor-pointer",
                            v.volumeMl === selectedVolume
                              ? "bg-[#161616] text-[#FAF8F5]"
                              : "text-[#6B655E] hover:text-[#161616]"
                          )}
                        >
                          {v.volumeMl} ml
                        </button>
                      ))}
                    </div>

                    {recommendedVariant && (
                      <span className="font-serif text-3xl text-[#161616]">
                        {formatPrice(recommendedVariant.priceCents)}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="primary"
                      disabled={!recommendedVariant || recommendedVariant.stock <= 0}
                      onClick={handleAddRecommended}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Ajouter au panier</span>
                    </Button>

                    <Button asChild variant="outline">
                      <Link href={`/parfums/${recommendedPerfume.slug}`}>
                        Découvrir la fiche
                      </Link>
                    </Button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="ml-auto inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[#6B655E] hover:text-[#161616] cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Recommencer
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
