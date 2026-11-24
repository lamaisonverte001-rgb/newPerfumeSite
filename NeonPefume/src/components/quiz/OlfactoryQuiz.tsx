"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, RotateCcw, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import type { PerfumeWithVariants } from "@/types/perfume";

interface QuizOption {
  id: string;
  label: string;
  description: string;
  weights: Partial<Record<string, number>>; // par slug ou famille
}

interface QuizStep {
  id: string;
  eyebrow: string;
  question: string;
  options: QuizOption[];
}

const QUIZ_STEPS: QuizStep[] = [
  {
    id: "mood",
    eyebrow: "Question 01 / 03",
    question: "Quelle atmosphère vous évoque le luxe absolu ?",
    options: [
      {
        id: "woody-power",
        label: "Charisme boisé & fumé",
        description: "Bergamote incisive, bois nobles et élégance architecturale.",
        weights: { aventus: 4, "bois-altier": 3, Boisé: 2 },
      },
      {
        id: "warm-gourmand",
        label: "Douceur lactée & ambrée",
        description: "Vanille de Madagascar, miel blanc et cachemire sur peau nue.",
        weights: { "bianco-latte": 5, Ambré: 3 },
      },
      {
        id: "spicy-magnetic",
        label: "Sensualité épicée & feutrée",
        description: "Cannelle chaude, musc profond et magnétisme nocturne.",
        weights: { "musc-ravageur": 5, Épicé: 3 },
      },
      {
        id: "floral-solar",
        label: "Éclat floral & solaire",
        description: "Agrumes lumineux, pétales poudrés et vétiver élégant.",
        weights: { "bal-dafrique-absolu": 5, Floral: 3 },
      },
      {
        id: "marine-mineral",
        label: "Horizon marin & minéral",
        description: "Embruns méditerranéens, romarin sauvage et fraîcheur pure.",
        weights: { "acqua-di-gio-profondo": 5, Hespéridé: 3 },
      },
    ],
  },
  {
    id: "moment",
    eyebrow: "Question 02 / 03",
    question: "À quel instant souhaitez-vous porter cette signature ?",
    options: [
      {
        id: "day-signature",
        label: "Signature quotidienne lumineuse",
        description: "Du matin au soir, au bureau comme en voyage.",
        weights: {
          "acqua-di-gio-profondo": 3,
          "bal-dafrique-absolu": 3,
          "bois-altier": 2,
          aventus: 2,
        },
      },
      {
        id: "evening-gala",
        label: "Soirées & instants mémorables",
        description: "Une présence sculpturale qui capte instantanément l'attention.",
        weights: { aventus: 3, "musc-ravageur": 4, "bianco-latte": 2 },
      },
      {
        id: "autumn-winter",
        label: "Automne & hiver enveloppants",
        description: "Matières chaudes, bois résineux et notes réconfortantes.",
        weights: { "bianco-latte": 4, "musc-ravageur": 3, "bois-altier": 3 },
      },
      {
        id: "spring-summer",
        label: "Printemps & été rayonnants",
        description: "Zestes vifs, notes solaires et fraîcheur raffinée.",
        weights: { "acqua-di-gio-profondo": 4, "bal-dafrique-absolu": 4 },
      },
    ],
  },
  {
    id: "intensity",
    eyebrow: "Question 03 / 03",
    question: "Quelle intensité de sillage recherchez-vous ?",
    options: [
      {
        id: "subtle",
        label: "Voile cristallin & élégant (3/5)",
        description: "Raffiné, proche de la peau, d'une fraîcheur irréprochable.",
        weights: { "acqua-di-gio-profondo": 4, "bal-dafrique-absolu": 2 },
      },
      {
        id: "balanced",
        label: "Présence affirmée & équilibrée (4/5)",
        description: "Un sillage structuré qui se révèle avec distinction.",
        weights: { "bois-altier": 4, "bal-dafrique-absolu": 3, aventus: 2 },
      },
      {
        id: "intense",
        label: "Sillage absolu & haute tenue (5/5)",
        description: "Une empreinte profonde qui persiste jusqu'au lendemain.",
        weights: { aventus: 3, "bianco-latte": 3, "musc-ravageur": 4 },
      },
    ],
  },
];

interface OlfactoryQuizProps {
  perfumes: PerfumeWithVariants[];
}

export function OlfactoryQuiz({ perfumes }: OlfactoryQuizProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizOption>>({});
  const [completed, setCompleted] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<number>(50);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const currentStep = QUIZ_STEPS[stepIndex];

  const recommendation = useMemo(() => {
    if (!completed || perfumes.length === 0) return null;

    let bestPerfume = perfumes[0];
    let bestScore = -1;

    for (const perfume of perfumes) {
      let score = 0;
      for (const option of Object.values(answers)) {
        score += option.weights[perfume.slug] ?? 0;
        score += option.weights[perfume.olfactoryFamily] ?? 0;
      }
      if (score > bestScore) {
        bestScore = score;
        bestPerfume = perfume;
      }
    }

    return bestPerfume;
  }, [completed, answers, perfumes]);

  function handleSelectOption(option: QuizOption) {
    const nextAnswers = { ...answers, [currentStep.id]: option };
    setAnswers(nextAnswers);

    if (stepIndex < QUIZ_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  }

  function handleReset() {
    setAnswers({});
    setStepIndex(0);
    setCompleted(false);
    setSelectedVolume(50);
  }

  const activeVariant =
    recommendation?.variants.find((v) => v.volumeMl === selectedVolume) ??
    recommendation?.variants[0];

  function handleAddRecommended() {
    if (!recommendation || !activeVariant || activeVariant.stock <= 0) return;
    addItem({
      variantId: activeVariant.id,
      perfumeId: recommendation.id,
      slug: recommendation.slug,
      name: recommendation.name,
      subtitle: recommendation.subtitle,
      imageUrl: recommendation.imageUrl,
      volumeMl: activeVariant.volumeMl,
      priceCents: activeVariant.priceCents,
      sku: activeVariant.sku,
      maxStock: activeVariant.stock,
    });
    toast.success(
      `${recommendation.name} (${activeVariant.volumeMl} ml) ajouté au panier.`
    );
    openCart();
  }

  return (
    <section
      id="diagnostic"
      className="mx-auto max-w-5xl px-6 py-24 lg:px-10 lg:py-32"
    >
      <div className="text-center">
        <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
          Consultation Sur-Mesure
        </p>
        <h2 className="mt-3 font-serif text-4xl font-light text-[#161616] sm:text-5xl">
          Trouvez votre signature
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[#6B655E]">
          Répondez à trois questions pour révéler la création de la Maison qui
          entre en résonance avec votre personnalité.
        </p>
      </div>

      <div className="mt-12 border border-[#E5DFD5] bg-[#F2EDE6]/60 p-6 sm:p-10 lg:p-14">
        {/* Barre de progression */}
        {!completed && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#6B655E]">
              <span>{currentStep.eyebrow}</span>
              <span>
                {Math.round(((stepIndex + 1) / QUIZ_STEPS.length) * 100)}%
              </span>
            </div>
            <div className="mt-2.5 h-[2px] w-full bg-[#E5DFD5]">
              <div
                className="h-full bg-[#A68352] transition-all duration-500"
                style={{
                  width: `${((stepIndex + 1) / QUIZ_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="font-serif text-2xl font-light text-[#161616] sm:text-3xl">
                {currentStep.question}
              </h3>

              <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {currentStep.options.map((option) => {
                  const chosen = answers[currentStep.id]?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(option)}
                      className={cn(
                        "group flex flex-col items-start border p-5 text-left transition-all duration-200 cursor-pointer",
                        chosen
                          ? "border-[#161616] bg-[#161616] text-[#FAF8F5]"
                          : "border-[#E5DFD5] bg-[#FAF8F5] text-[#161616] hover:border-[#A68352]"
                      )}
                    >
                      <span className="font-serif text-xl font-normal">
                        {option.label}
                      </span>
                      <span
                        className={cn(
                          "mt-1.5 text-xs leading-relaxed",
                          chosen ? "text-[#FAF8F5]/80" : "text-[#6B655E]"
                        )}
                      >
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setStepIndex((prev) => prev - 1)}
                  className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#6B655E] hover:text-[#161616] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Question précédente
                </button>
              )}
            </motion.div>
          ) : (
            recommendation && (
              <motion.div
                key="quiz-result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 items-center gap-8 md:grid-cols-12"
              >
                <div className="md:col-span-5">
                  <div className="relative mx-auto aspect-[4/5] max-w-[280px] border border-[#E5DFD5] bg-[#FAF8F5] p-6">
                    <Image
                      src={recommendation.imageUrl}
                      alt={recommendation.name}
                      fill
                      sizes="280px"
                      className="object-contain p-5"
                    />
                  </div>
                </div>

                <div className="md:col-span-7">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#A68352]">
                    Votre Accord Idéal · {recommendation.olfactoryFamily}
                  </p>
                  <h3 className="mt-2 font-serif text-4xl font-light text-[#161616]">
                    {recommendation.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#6B655E]">
                    {recommendation.subtitle}
                  </p>

                  <p className="mt-5 text-sm leading-relaxed text-[#6B655E]">
                    {recommendation.description}
                  </p>

                  <div className="mt-5 border-y border-[#E5DFD5] py-4 text-xs text-[#6B655E]">
                    <p>
                      <strong className="font-medium text-[#161616]">
                        Notes clés :
                      </strong>{" "}
                      {[
                        recommendation.topNotes[0],
                        recommendation.heartNotes[0],
                        recommendation.baseNotes[0],
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>

                  {/* Choix contenance + CTA */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {recommendation.variants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVolume(variant.volumeMl)}
                        className={cn(
                          "border px-4 py-2 text-xs tracking-[0.12em] transition-colors cursor-pointer",
                          activeVariant?.id === variant.id
                            ? "border-[#161616] bg-[#161616] text-[#FAF8F5]"
                            : "border-[#E5DFD5] bg-[#FAF8F5] text-[#161616] hover:border-[#A68352]"
                        )}
                      >
                        {variant.volumeMl} ml — {formatPrice(variant.priceCents)}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      onClick={handleAddRecommended}
                      disabled={!activeVariant || activeVariant.stock <= 0}
                    >
                      <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                      Ajouter au panier
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/parfums/${recommendation.slug}`}>
                        Découvrir la fiche
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </Link>
                    </Button>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#6B655E] hover:text-[#161616] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Recommencer le diagnostic
                  </button>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
