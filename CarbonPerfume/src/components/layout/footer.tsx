"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { BRAND_CONFIG } from "@/config/brand";
import { newsletterSchema, type NewsletterInput } from "@/lib/validations";
import { subscribeNewsletterAction } from "@/actions/newsletter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: NewsletterInput) => {
    const res = await subscribeNewsletterAction(values.email);
    if (res.ok) {
      setSubscribed(true);
      toast.success(res.message);
      reset();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <footer className="border-t border-[#E5DFD5] bg-[#F2EDE6]/75 text-[#161616]">
      {/* Newsletter Editorial Strip */}
      <div className="mx-auto max-w-7xl border-b border-[#E5DFD5] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#A68352]">
              Le Cercle Privé
            </p>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-[#161616] sm:text-4xl">
              Les carnets d&apos;atelier &amp; éditions numérotées
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#6B655E]">
              Recevez en avant-première nos nouvelles macérations de Grasse, invitations aux présentations privées et essais olfactifs saisonniers.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="flex items-center gap-3 border border-[#A68352]/40 bg-[#FAF8F5] p-5 text-sm text-[#161616]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A68352] text-[#FAF8F5]">
                  <Check className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium">Inscription enregistrée</p>
                  <p className="text-xs text-[#6B655E]">
                    Merci de rejoindre la Maison {BRAND_CONFIG.name}.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-2"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Votre adresse email
                    </label>
                    <Input
                      id="newsletter-email"
                      type="email"
                      placeholder="Votre adresse email…"
                      aria-invalid={Boolean(errors.email)}
                      {...register("email")}
                      className="h-12 bg-[#FAF8F5]"
                    />
                  </div>
                  <Button
                    type="submit"
                    id="newsletter-submit"
                    disabled={isSubmitting}
                    className="h-12 px-7"
                  >
                    <span>{isSubmitting ? "Inscription…" : "S'inscrire"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {errors.email && (
                  <p role="alert" className="text-xs text-[#9B2C2C]">
                    {errors.email.message}
                  </p>
                )}
                <p className="text-[11px] text-[#6B655E]">
                  Aucun envoi superflu. Désinscription libre en un clic à tout moment.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="relative h-7 w-12">
                <Image
                  src={BRAND_CONFIG.logoUrl}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-2xl tracking-[0.2em]">
                {BRAND_CONFIG.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#6B655E]">
              Maison de haute parfumerie contemporaine dédiée aux sillages de caractère. Extraits concentrés assemblés à Grasse dans des flacons rechargeables en verre cristallin.
            </p>
            <p className="mt-4 text-xs text-[#6B655E]">{BRAND_CONFIG.address}</p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#161616]">
              Collection
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6B655E]">
              <li>
                <Link href="/parfums/bois-altier" className="hover:text-[#161616]">
                  Bois Altier
                </Link>
              </li>
              <li>
                <Link href="/parfums/aventus" className="hover:text-[#161616]">
                  Aventus
                </Link>
              </li>
              <li>
                <Link href="/parfums/bal-dafrique-absolu" className="hover:text-[#161616]">
                  Bal d&apos;Afrique Absolu
                </Link>
              </li>
              <li>
                <Link href="/parfums/bianco-latte" className="hover:text-[#161616]">
                  Bianco Latte
                </Link>
              </li>
              <li>
                <Link href="/parfums/musc-ravageur" className="hover:text-[#161616]">
                  Musc Ravageur
                </Link>
              </li>
              <li>
                <Link href="/parfums/acqua-di-gio-profondo" className="hover:text-[#161616]">
                  Acqua di Gio Profondo
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#161616]">
              La Maison
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6B655E]">
              <li>
                <Link href="/#savoir-faire" className="hover:text-[#161616]">
                  L&apos;Art du Sillage
                </Link>
              </li>
              <li>
                <Link href="/#diagnostic" className="hover:text-[#161616]">
                  Quiz Olfactif
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-[#161616]">
                  Votre Panier
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#161616]">
                  Atelier Admin
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#161616]">
              Service Conciergerie
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[#6B655E]">
              Du lundi au samedi, 10h – 19h
              <br />
              <span className="text-[#161616]">{BRAND_CONFIG.contactEmail}</span>
            </p>
            <p className="mt-4 text-xs text-[#6B655E]">
              Livraison offerte dès 120 € • Coffret scellé &amp; message calligraphié sur demande.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E5DFD5] pt-8 text-xs text-[#6B655E] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. Tous droits réservés.
          </p>
          <p className="uppercase tracking-[0.18em]">
            Haute Parfumerie • Composé en Europe
          </p>
        </div>
      </div>
    </footer>
  );
}
