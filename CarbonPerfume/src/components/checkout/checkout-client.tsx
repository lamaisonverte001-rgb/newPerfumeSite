"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  Sparkles,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  Gift,
} from "lucide-react";
import { toast } from "sonner";
import {
  checkoutCustomerSchema,
  type CheckoutCustomerFormValues,
} from "@/lib/validations";
import { createOrderAction } from "@/actions/checkout";
import { useCartStore, computeCartTotals } from "@/store/cart-store";
import { BRAND_CONFIG } from "@/config/brand";
import { formatPrice } from "@/lib/utils";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CheckoutClient({ stripeEnabled }: { stripeEnabled: boolean }) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const clearCart = useCartStore((s) => s.clearCart);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const { subtotalCents, shippingCents, totalCents } = computeCartTotals(items);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutCustomerFormValues>({
    resolver: zodResolver(checkoutCustomerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
      giftNote: "",
      cardHolder: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const fillDemoCard = () => {
    setValue("cardHolder", "CAMILLE LAURENT", { shouldValidate: true });
    setValue("cardNumber", "4242 4242 4242 4242", { shouldValidate: true });
    setValue("cardExpiry", "09/29", { shouldValidate: true });
    setValue("cardCvc", "842", { shouldValidate: true });
  };

  const onSubmit = async (values: CheckoutCustomerFormValues) => {
    setServerError(null);
    if (items.length === 0) {
      setServerError("Votre panier est vide.");
      return;
    }

    const result = await createOrderAction({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      postalCode: values.postalCode,
      country: values.country,
      giftNote: values.giftNote,
      items: items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    });

    if (!result.ok || !result.orderNumber) {
      const message =
        result.error ?? "Impossible de valider votre commande.";
      setServerError(message);
      toast.error(message);
      return;
    }

    setIsRedirecting(true);
    clearCart();
    toast.success(`Commande ${result.orderNumber} confirmée.`);
    router.push(`/commande/${result.orderNumber}`);
  };

  if (!hasHydrated) {
    return (
      <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 text-center text-sm text-[#6B655E]">
        Chargement de votre sélection…
      </div>
    );
  }

  if (items.length === 0 && !isRedirecting) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-5 pt-36 pb-28 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#E5DFD5] bg-[#F2EDE6]">
          <ShoppingBag className="h-6 w-6 stroke-[1.4] text-[#6B655E]" />
        </div>
        <h1 className="mt-6 font-serif text-4xl text-[#161616]">
          Votre panier est vide
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#6B655E]">
          Sélectionnez un extrait de parfum parmi nos créations avant de poursuivre vers le règlement.
        </p>
        <Button asChild variant="primary" className="mt-8">
          <Link href="/#collection">Parcourir la Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-24 sm:px-8 lg:px-12 lg:pt-32">
      <Link
        href="/#collection"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#6B655E] hover:text-[#161616]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Continuer mes découvertes
      </Link>

      <div className="mt-6 border-b border-[#E5DFD5] pb-6">
        <p className="text-[11px] uppercase tracking-[0.26em] text-[#A68352]">
          Finalisation de votre écrin
        </p>
        <h1 className="mt-2 font-serif text-4xl font-normal text-[#161616] sm:text-5xl">
          Validation &amp; Expédition
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-12 grid items-start gap-12 lg:grid-cols-12"
      >
        {/* Left: Customer, Shipping & Payment Form */}
        <div className="space-y-10 lg:col-span-7">
          {serverError && (
            <div
              role="alert"
              className="border border-[#9B2C2C]/40 bg-[#9B2C2C]/5 p-4 text-sm text-[#9B2C2C]"
            >
              {serverError}
            </div>
          )}

          {/* 1. Coordonnées */}
          <section className="border border-[#E5DFD5] bg-[#FFFDF9] p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-[#161616]">
              1. Vos coordonnées
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="checkout-firstName"
                  className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                >
                  Prénom *
                </label>
                <Input
                  id="checkout-firstName"
                  aria-invalid={Boolean(errors.firstName)}
                  placeholder="Camille"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-[#9B2C2C]">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-lastName"
                  className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                >
                  Nom *
                </label>
                <Input
                  id="checkout-lastName"
                  aria-invalid={Boolean(errors.lastName)}
                  placeholder="Laurent"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-[#9B2C2C]">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-email"
                  className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                >
                  Email *
                </label>
                <Input
                  id="checkout-email"
                  type="email"
                  aria-invalid={Boolean(errors.email)}
                  placeholder="camille.laurent@exemple.fr"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[#9B2C2C]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                >
                  Téléphone *
                </label>
                <Input
                  id="checkout-phone"
                  type="tel"
                  aria-invalid={Boolean(errors.phone)}
                  placeholder="+33 6 12 34 56 78"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-[#9B2C2C]">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 2. Adresse de livraison */}
          <section className="border border-[#E5DFD5] bg-[#FFFDF9] p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-[#161616]">
              2. Adresse de livraison
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="checkout-address"
                  className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                >
                  Adresse complète *
                </label>
                <Input
                  id="checkout-address"
                  aria-invalid={Boolean(errors.address)}
                  placeholder="24 Rue Saint-Sulpice"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-[#9B2C2C]">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="checkout-postalCode"
                    className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                  >
                    Code postal *
                  </label>
                  <Input
                    id="checkout-postalCode"
                    aria-invalid={Boolean(errors.postalCode)}
                    placeholder="75006"
                    {...register("postalCode")}
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-xs text-[#9B2C2C]">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-city"
                    className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                  >
                    Ville *
                  </label>
                  <Input
                    id="checkout-city"
                    aria-invalid={Boolean(errors.city)}
                    placeholder="Paris"
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-[#9B2C2C]">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-country"
                    className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                  >
                    Pays *
                  </label>
                  <Input
                    id="checkout-country"
                    aria-invalid={Boolean(errors.country)}
                    placeholder="France"
                    {...register("country")}
                  />
                  {errors.country && (
                    <p className="mt-1 text-xs text-[#9B2C2C]">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label
                  htmlFor="checkout-giftNote"
                  className="mb-1.5 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                >
                  <Gift className="h-3.5 w-3.5 text-[#A68352]" />
                  Message cadeau calligraphié (optionnel)
                </label>
                <Textarea
                  id="checkout-giftNote"
                  placeholder="Votre dédicace sera glissée sur bristol coton scellé à la cire…"
                  aria-invalid={Boolean(errors.giftNote)}
                  {...register("giftNote")}
                />
                {errors.giftNote && (
                  <p className="mt-1 text-xs text-[#9B2C2C]">
                    {errors.giftNote.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 3. Règlement Sécurisé */}
          <section className="border border-[#E5DFD5] bg-[#FFFDF9] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-[#161616]">
                  3. Règlement sécurisé
                </h2>
                <p className="mt-1 text-xs text-[#6B655E]">
                  {stripeEnabled
                    ? "Passerelle Stripe activée."
                    : "Mode démonstration sécurisé — aucun débit bancaire réel."}
                </p>
              </div>

              <button
                type="button"
                id="fill-demo-card"
                onClick={fillDemoCard}
                className="border border-[#A68352]/50 bg-[#F2EDE6] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[#161616] transition-colors hover:border-[#A68352] cursor-pointer"
              >
                Pré-remplir carte test
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="checkout-cardHolder"
                  className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                >
                  Titulaire de la carte *
                </label>
                <Input
                  id="checkout-cardHolder"
                  placeholder="CAMILLE LAURENT"
                  aria-invalid={Boolean(errors.cardHolder)}
                  {...register("cardHolder")}
                />
                {errors.cardHolder && (
                  <p className="mt-1 text-xs text-[#9B2C2C]">
                    {errors.cardHolder.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-cardNumber"
                  className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                >
                  Numéro de carte *
                </label>
                <div className="relative">
                  <Input
                    id="checkout-cardNumber"
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    aria-invalid={Boolean(errors.cardNumber)}
                    {...register("cardNumber")}
                    className="pr-11"
                  />
                  <CreditCard className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B655E]" />
                </div>
                {errors.cardNumber && (
                  <p className="mt-1 text-xs text-[#9B2C2C]">
                    {errors.cardNumber.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkout-cardExpiry"
                    className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                  >
                    Expiration (MM/AA) *
                  </label>
                  <Input
                    id="checkout-cardExpiry"
                    placeholder="09/29"
                    aria-invalid={Boolean(errors.cardExpiry)}
                    {...register("cardExpiry")}
                  />
                  {errors.cardExpiry && (
                    <p className="mt-1 text-xs text-[#9B2C2C]">
                      {errors.cardExpiry.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-cardCvc"
                    className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-[#6B655E]"
                  >
                    Cryptogramme CVC *
                  </label>
                  <Input
                    id="checkout-cardCvc"
                    inputMode="numeric"
                    placeholder="842"
                    aria-invalid={Boolean(errors.cardCvc)}
                    {...register("cardCvc")}
                  />
                  {errors.cardCvc && (
                    <p className="mt-1 text-xs text-[#9B2C2C]">
                      {errors.cardCvc.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Sticky Order Summary */}
        <aside className="lg:sticky lg:top-28 lg:col-span-5">
          <div className="border border-[#E5DFD5] bg-[#F2EDE6]/70 p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-[#161616]">
              Récapitulatif de votre écrin
            </h2>

            <ul className="mt-6 divide-y divide-[#E5DFD5]">
              {items.map((item) => (
                <li key={item.variantId} className="flex items-center gap-4 py-4">
                  <div className="relative h-20 w-16 shrink-0 border border-[#E5DFD5] bg-[#FAF8F5] p-1.5">
                    <Image
                      src={item.imageUrl}
                      alt={item.perfumeName}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-lg text-[#161616]">
                      {item.perfumeName}
                    </p>
                    <p className="text-xs text-[#6B655E]">
                      {item.volumeMl} ml × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium tabular-nums text-[#161616]">
                    {formatPrice(item.priceCents * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center gap-2 border border-[#E5DFD5] bg-[#FAF8F5] p-3 text-xs text-[#6B655E]">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#A68352]" />
              <span>
                {BRAND_CONFIG.complimentarySamplesCount} échantillons signature inclus gratuitement.
              </span>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-[#E5DFD5] pt-5 text-sm">
              <div className="flex justify-between text-[#6B655E]">
                <span>Sous-total</span>
                <span className="tabular-nums">{formatPrice(subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-[#6B655E]">
                <span>Expédition suivie</span>
                <span className="tabular-nums">
                  {shippingCents === 0 ? "Offerte" : formatPrice(shippingCents)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#E5DFD5] pt-4">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#161616]">
                  Total TTC
                </span>
                <span className="font-serif text-3xl font-medium tabular-nums text-[#161616]">
                  {formatPrice(totalCents)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              id="checkout-submit-order"
              size="lg"
              variant="primary"
              disabled={isSubmitting || isRedirecting}
              className="mt-7 w-full"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>
                {isSubmitting || isRedirecting
                  ? "Validation en cours…"
                  : `Confirmer la commande — ${formatPrice(totalCents)}`}
              </span>
            </Button>

            <p className="mt-4 text-center text-[11px] text-[#6B655E]">
              Transaction chiffrée • Vérification atomique des stocks en temps réel.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
