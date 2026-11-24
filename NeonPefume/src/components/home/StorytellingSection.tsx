"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function StorytellingSection() {
  return (
    <section
      id="savoir-faire"
      className="border-y border-[#E5DFD5] bg-[#F2EDE6]/60 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Mise en page asymétrique des 2 visuels de la collection */}
          <div className="relative lg:col-span-6">
            <div className="grid grid-cols-12 items-end gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75 }}
                className="col-span-7 border border-[#E5DFD5] bg-[#FAF8F5] p-5 sm:p-8"
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="/images/perfumes/bois-altier.png"
                    alt="Flacon Bois Altier — macération de cèdre et d'encens"
                    fill
                    sizes="(max-width: 1024px) 55vw, 30vw"
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-[#6B655E]">
                  N° 02 · Bois Altier
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, delay: 0.14 }}
                className="col-span-5 -mb-6 border border-[#E5DFD5] bg-[#FAF8F5] p-4 sm:p-6"
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="/images/perfumes/musc-ravageur.png"
                    alt="Flacon Musc Ravageur — épices rares et ambre"
                    fill
                    sizes="(max-width: 1024px) 40vw, 22vw"
                    className="object-contain"
                  />
                </div>
                <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-[#6B655E]">
                  N° 05 · Musc Ravageur
                </p>
              </motion.div>
            </div>
          </div>

          {/* Récit éditorial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75 }}
            className="pt-8 lg:col-span-6 lg:pl-8 lg:pt-0"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
              Savoir-Faire &amp; Matières Premières
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-[1.12] text-[#161616] sm:text-5xl">
              L&apos;Art du Sillage
            </h2>

            <div className="mt-7 space-y-5 text-sm leading-[1.85] text-[#6B655E]">
              <p>
                Avant d&apos;être mis en flacon, chaque parfum repose entre six et
                huit semaines à l&apos;abri de la lumière dans nos ateliers
                grassois. Cette macération patiente permet aux absolues
                florales, aux bois résineux et aux agrumes pressés à froid
                d&apos;épouser l&apos;alcool de blé biologique avec une rondeur
                inimitable.
              </p>
              <p>
                Nos flacons en verre lourd au dôme intérieur sculpté protègent
                la pureté du jus tout en révélant ses reflets dorés. Coiffés
                d&apos;un capot laqué noir serti d&apos;or et ornés d&apos;un
                médaillon échancré propre à chaque création, ils sont conçus
                pour traverser le temps sur votre coiffeuse.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#E5DFD5] pt-8">
              <div>
                <p className="font-serif text-3xl font-light text-[#161616]">
                  25%
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#6B655E]">
                  Concentration Extrait
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl font-light text-[#161616]">
                  45j
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#6B655E]">
                  Macération lente
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl font-light text-[#161616]">
                  100%
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#6B655E]">
                  Flaconnage Europe
                </p>
              </div>
            </div>

            <div className="mt-9">
              <Link
                href="/parfums/bois-altier"
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#161616] transition-colors hover:text-[#A68352]"
              >
                Découvrir Bois Altier
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
