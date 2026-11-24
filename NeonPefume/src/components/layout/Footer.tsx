"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { BRAND_CONFIG } from "@/config/brand";
import { newsletterSchema } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleNewsletterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);

    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? "Adresse invalide.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        setErrorMsg(data.error ?? "Une erreur est survenue.");
        toast.error(data.error ?? "Impossible de finaliser l'inscription.");
        return;
      }

      setSubscribed(true);
      setEmail("");
      toast.success(data.message ?? "Bienvenue dans le cercle privé de la Maison.");
    } catch {
      setErrorMsg("Erreur réseau. Veuillez réessayer.");
      toast.error("Erreur réseau lors de l'inscription.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="border-t border-[#E5DFD5] bg-[#F2EDE6]">
      {/* Section Newsletter */}
      <div className="mx-auto max-w-7xl border-b border-[#E5DFD5] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
              Cercle Privé
            </p>
            <h2 className="mt-3 font-serif text-3xl font-light text-[#161616] sm:text-4xl">
              Recevez les carnets de la Maison
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6B655E]">
              Éditions limitées numérotées, récits de récoltes à Grasse et
              invitations privées en avant-première.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="flex items-center gap-3 border border-[#A68352]/40 bg-[#FAF8F5] px-6 py-5 text-sm text-[#161616]">
                <Check className="h-5 w-5 text-[#A68352]" strokeWidth={1.5} />
                <span>
                  Merci pour votre inscription. Vous recevrez prochainement nos
                  nouvelles éditions.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                noValidate
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="flex-1">
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Adresse e-mail
                  </label>
                  <Input
                    id="footer-newsletter-email"
                    type="email"
                    placeholder="votre.nom@exemple.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    aria-invalid={Boolean(errorMsg)}
                    className="bg-[#FAF8F5]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="shrink-0"
                >
                  {submitting ? "Envoi..." : "S'inscrire"}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Button>
              </form>
            )}
            {errorMsg && (
              <p className="mt-2 text-xs text-[#8B2C2C]" role="alert">
                {errorMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Colonnes Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-14">
                <Image
                  src={BRAND_CONFIG.logoPath}
                  alt={BRAND_CONFIG.name}
                  fill
                  sizes="56px"
                  className="object-contain object-left"
                />
              </div>
              <span className="font-serif text-lg tracking-[0.22em] text-[#161616]">
                {BRAND_CONFIG.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-[#6B655E]">
              {BRAND_CONFIG.subtitle}. Chaque flacon est assemblé et contrôlé à
              la main avec des matières premières sourcées de manière
              responsable.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#161616]">
              La Maison
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[#6B655E]">
              <li>
                <Link href="/#collection" className="hover:text-[#161616] transition-colors">
                  La Collection
                </Link>
              </li>
              <li>
                <Link href="/#savoir-faire" className="hover:text-[#161616] transition-colors">
                  L&apos;Art du Sillage
                </Link>
              </li>
              <li>
                <Link href="/#diagnostic" className="hover:text-[#161616] transition-colors">
                  Diagnostic Olfactif
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#161616] transition-colors">
                  Espace Administration
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#161616]">
              Conciergerie
            </h3>
            <ul className="mt-4 space-y-2 text-xs text-[#6B655E]">
              <li>{BRAND_CONFIG.address}</li>
              <li>{BRAND_CONFIG.contactEmail}</li>
              <li>{BRAND_CONFIG.contactPhone}</li>
              <li className="pt-1 text-[#A68352]">
                Livraison offerte dès 120 € · 2 échantillons offerts
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E5DFD5] pt-6 text-[11px] text-[#6B655E] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. Tous droits réservés.
          </p>
          <p className="uppercase tracking-[0.18em]">
            {BRAND_CONFIG.atelierLocation}
          </p>
        </div>
      </div>
    </footer>
  );
}
