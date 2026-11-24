"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CreditCard,
  Gift,
  Lock,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCartStore,
  selectCartSubtotal,
} from "@/store/cart-store";
import {
  checkoutFormSchema,
  type CheckoutFormValues,
} from "@/lib/validations";
import { calculateShippingCents, formatPrice } from "@/lib/utils";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function CheckoutClient() {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [submitting, setSubmitting] = useState(false);

  const items = useCartStore((s) => s.items);
  const subtotalCents = useCartStore(selectCartSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const shippingCents = calculateShippingCents(subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      shippingCity: "",
      shippingPostalCode: "",
      shippingCountry: "France",
      giftNote: "",
      cardHolder: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  async function onSubmit(values: CheckoutFormValues) {
    if (items.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${values.firstName} ${values.lastName}`.trim(),
          customerEmail: values.customerEmail,
          customerPhone: values.customerPhone,
          shippingAddress: values.shippingAddress,
          shippingCity: values.shippingCity,
          shippingPostalCode: values.shippingPostalCode,
          shippingCountry: values.shippingCountry,
          giftNote: values.giftNote?.trim() || undefined,
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as {
        orderNumber?: string;
        error?: string;
      };

      if (!response.ok || !data.orderNumber) {
        toast.error(data.error ?? "Impossible de valider votre commande.");
        return;
      }

      clearCart();
      toast.success(`Commande ${data.orderNumber} confirmée.`);
      router.push(`/commande/${data.orderNumber}`);
    } catch {
      toast.error("Erreur de connexion lors de la validation.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24 text-center text-xs uppercase tracking-[0.2em] text-[#6B655E]">
        Préparation de votre commande...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-36 pb-28 text-center">
        <ShoppingBag
          className="mx-auto h-10 w-10 text-[#A68352]/70"
          strokeWidth={1.25}
        />
        <h1 className="mt-5 font-serif text-4xl font-light text-[#161616]">
          Votre panier est vide
        </h1>
        <p className="mt-3 text-sm text-[#6B655E]">
          Sélectionnez l&apos;une de nos créations avant de procéder au
          règlement.
        </p>
        <Button asChild className="mt-8" size="lg">
          <Link href="/#collection">Découvrir la Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 pb-24 lg:px-10 lg:pt-36">
      <Link
        href="/#collection"
        className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#6B655E] transition-colors hover:text-[#161616]"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Continuer mes découvertes
      </Link>

      <div className="mt-6 border-b border-[#E5DFD5] pb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
          Finalisation de commande
        </p>
        <h1 className="mt-2 font-serif text-4xl font-light text-[#161616] sm:text-5xl">
          Expédition &amp; Règlement
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12"
      >
        {/* Formulaire Client & Paiement */}
        <div className="space-y-10 lg:col-span-7">
          {/* 1. Coordonnées */}
          <section className="border border-[#E5DFD5] bg-[#FAF8F5] p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-normal text-[#161616]">
              1. Vos coordonnées
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                >
                  Prénom *
                </label>
                <Input id="firstName" {...register("firstName")} placeholder="Camille" />
                {errors.firstName && (
                  <p className="mt-1.5 text-xs text-[#8B2C2C]">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                >
                  Nom *
                </label>
                <Input id="lastName" {...register("lastName")} placeholder="Laurent" />
                {errors.lastName && (
                  <p className="mt-1.5 text-xs text-[#8B2C2C]">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="customerEmail"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                >
                  Adresse e-mail *
                </label>
                <Input
                  id="customerEmail"
                  type="email"
                  {...register("customerEmail")}
                  placeholder="camille.laurent@exemple.fr"
                />
                {errors.customerEmail && (
                  <p className="mt-1.5 text-xs text-[#8B2C2C]">
                    {errors.customerEmail.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="customerPhone"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                >
                  Téléphone *
                </label>
                <Input
                  id="customerPhone"
                  type="tel"
                  {...register("customerPhone")}
                  placeholder="+33 6 12 34 56 78"
                />
                {errors.customerPhone && (
                  <p className="mt-1.5 text-xs text-[#8B2C2C]">
                    {errors.customerPhone.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 2. Adresse de livraison */}
          <section className="border border-[#E5DFD5] bg-[#FAF8F5] p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-normal text-[#161616]">
              2. Adresse de livraison
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="shippingAddress"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                >
                  Adresse complète *
                </label>
                <Input
                  id="shippingAddress"
                  {...register("shippingAddress")}
                  placeholder="24 Rue du Faubourg Saint-Honoré"
                />
                {errors.shippingAddress && (
                  <p className="mt-1.5 text-xs text-[#8B2C2C]">
                    {errors.shippingAddress.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="shippingPostalCode"
                    className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                  >
                    Code postal *
                  </label>
                  <Input
                    id="shippingPostalCode"
                    {...register("shippingPostalCode")}
                    placeholder="75008"
                  />
                  {errors.shippingPostalCode && (
                    <p className="mt-1.5 text-xs text-[#8B2C2C]">
                      {errors.shippingPostalCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="shippingCity"
                    className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                  >
                    Ville *
                  </label>
                  <Input
                    id="shippingCity"
                    {...register("shippingCity")}
                    placeholder="Paris"
                  />
                  {errors.shippingCity && (
                    <p className="mt-1.5 text-xs text-[#8B2C2C]">
                      {errors.shippingCity.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="shippingCountry"
                    className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                  >
                    Pays *
                  </label>
                  <select
                    id="shippingCountry"
                    {...register("shippingCountry")}
                    className="flex h-12 w-full border border-[#E5DFD5] bg-[#FAF8F5] px-4 text-sm text-[#161616] focus:border-[#A68352] focus:outline-none"
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Italie">Italie</option>
                    <option value="Espagne">Espagne</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="giftNote"
                  className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                >
                  <Gift className="h-3.5 w-3.5 text-[#A68352]" strokeWidth={1.5} />
                  Message cadeau calligraphié (optionnel)
                </label>
                <Textarea
                  id="giftNote"
                  {...register("giftNote")}
                  placeholder="Ajoutez un mot personnalisé qui sera imprimé sur une carte vergée ivoire..."
                />
                {errors.giftNote && (
                  <p className="mt-1.5 text-xs text-[#8B2C2C]">
                    {errors.giftNote.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 3. Paiement sécurisé simulé (prêt pour Stripe) */}
          <section className="border border-[#E5DFD5] bg-[#FAF8F5] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-normal text-[#161616]">
                3. Paiement sécurisé
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[#A68352]">
                <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
                SSL Chiffré
              </span>
            </div>

            <p className="mt-2 text-xs text-[#6B655E]">
              Mode démonstration sécurisé (prêt pour intégration Stripe via{" "}
              <code className="text-[#161616]">STRIPE_SECRET_KEY</code>). Aucun
              débit réel ne sera effectué.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="cardHolder"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                >
                  Titulaire de la carte *
                </label>
                <Input
                  id="cardHolder"
                  {...register("cardHolder")}
                  placeholder="CAMILLE LAURENT"
                />
                {errors.cardHolder && (
                  <p className="mt-1.5 text-xs text-[#8B2C2C]">
                    {errors.cardHolder.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cardNumber"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                >
                  Numéro de carte *
                </label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    inputMode="numeric"
                    {...register("cardNumber", {
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue("cardNumber", formatCardNumber(e.target.value), {
                          shouldValidate: false,
                        });
                      },
                    })}
                    placeholder="4242 4242 4242 4242"
                    className="pr-11"
                  />
                  <CreditCard
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B655E]"
                    strokeWidth={1.5}
                  />
                </div>
                {errors.cardNumber && (
                  <p className="mt-1.5 text-xs text-[#8B2C2C]">
                    {errors.cardNumber.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="cardExpiry"
                    className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                  >
                    Expiration (MM/AA) *
                  </label>
                  <Input
                    id="cardExpiry"
                    inputMode="numeric"
                    {...register("cardExpiry", {
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue("cardExpiry", formatExpiry(e.target.value), {
                          shouldValidate: false,
                        });
                      },
                    })}
                    placeholder="08/29"
                  />
                  {errors.cardExpiry && (
                    <p className="mt-1.5 text-xs text-[#8B2C2C]">
                      {errors.cardExpiry.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cardCvc"
                    className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B655E]"
                  >
                    CVC *
                  </label>
                  <Input
                    id="cardCvc"
                    inputMode="numeric"
                    maxLength={4}
                    {...register("cardCvc")}
                    placeholder="424"
                  />
                  {errors.cardCvc && (
                    <p className="mt-1.5 text-xs text-[#8B2C2C]">
                      {errors.cardCvc.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Récapitulatif Sticky */}
        <aside className="lg:col-span-5">
          <div className="sticky top-28 border border-[#E5DFD5] bg-[#F2EDE6]/70 p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-normal text-[#161616]">
              Récapitulatif de l&apos;écrin
            </h2>

            <ul className="mt-6 divide-y divide-[#E5DFD5]">
              {items.map((item) => (
                <li key={item.variantId} className="flex items-center gap-4 py-4 first:pt-0">
                  <div className="relative h-20 w-16 shrink-0 border border-[#E5DFD5] bg-[#FAF8F5]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-lg leading-tight text-[#161616]">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-[#6B655E]">
                      {item.volumeMl} ml · Qté {item.quantity}
                    </p>
                  </div>
                  <span className="font-serif text-base text-[#161616]">
                    {formatPrice(item.priceCents * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2.5 border-t border-[#E5DFD5] pt-5 text-xs text-[#6B655E]">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="text-[#161616]">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Livraison suivie</span>
                <span className="text-[#161616]">
                  {shippingCents === 0 ? "Offerte" : formatPrice(shippingCents)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>2 échantillons découverte</span>
                <span className="text-[#A68352]">Offerts</span>
              </div>
              <div className="flex justify-between border-t border-[#E5DFD5] pt-4 text-sm text-[#161616]">
                <span className="text-xs font-medium uppercase tracking-[0.18em]">
                  Total TTC
                </span>
                <span className="font-serif text-2xl">
                  {formatPrice(totalCents)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="mt-7 w-full"
            >
              {submitting
                ? "Validation en cours..."
                : `Confirmer la commande · ${formatPrice(totalCents)}`}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#6B655E]">
              <ShieldCheck className="h-4 w-4 text-[#A68352]" strokeWidth={1.5} />
              Stock vérifié et réservé en temps réel
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
