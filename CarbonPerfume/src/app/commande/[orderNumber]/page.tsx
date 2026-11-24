import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Gift, MapPin, PackageCheck } from "lucide-react";
import { getOrderByNumber } from "@/lib/queries";
import { BRAND_CONFIG } from "@/config/brand";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente de règlement",
  PAID: "Confirmée & réglée",
  PREPARING: "En préparation à l'atelier",
  SHIPPED: "Expédiée",
  CANCELLED: "Annulée",
};

interface OrderConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({
  params,
}: OrderConfirmationPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Commande ${orderNumber}`,
  };
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(order.createdAt);

  return (
    <div className="mx-auto max-w-4xl px-5 pt-32 pb-24 sm:px-8 lg:px-12">
      {/* Header Banner */}
      <div className="border border-[#E5DFD5] bg-[#FFFDF9] p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#161616] text-[#FAF8F5]">
          <Check className="h-6 w-6 stroke-[1.6]" />
        </div>

        <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
          Merci pour votre confiance
        </p>

        <h1 className="mt-3 font-serif text-4xl text-[#161616] sm:text-5xl">
          Votre écrin est enregistré
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#6B655E]">
          Un récapitulatif est associé à l&apos;adresse{" "}
          <strong className="font-medium text-[#161616]">
            {order.customerEmail}
          </strong>
          . Nos artisans préparent votre coffret scellé ainsi que vos 2 échantillons offerts.
        </p>

        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-6 border border-[#E5DFD5] bg-[#F2EDE6]/60 px-6 py-3.5 text-xs">
          <div>
            <span className="uppercase tracking-[0.16em] text-[#6B655E]">
              Référence :{" "}
            </span>
            <strong className="font-medium tracking-wider text-[#161616]">
              {order.orderNumber}
            </strong>
          </div>
          <span className="text-[#E5DFD5]">|</span>
          <div>
            <span className="uppercase tracking-[0.16em] text-[#6B655E]">
              Statut :{" "}
            </span>
            <strong className="font-medium text-[#A68352]">
              {STATUS_LABELS[order.status] ?? order.status}
            </strong>
          </div>
          <span className="text-[#E5DFD5]">|</span>
          <div className="text-[#6B655E]">{formattedDate}</div>
        </div>
      </div>

      {/* Items & Shipping Grid */}
      <div className="mt-8 grid gap-8 md:grid-cols-12">
        {/* Ordered Perfumes */}
        <div className="border border-[#E5DFD5] bg-[#FAF8F5] p-6 sm:p-8 md:col-span-7">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#161616]">
            <PackageCheck className="h-4 w-4 text-[#A68352]" />
            <span>Créations commandées</span>
          </div>

          <ul className="mt-6 divide-y divide-[#E5DFD5]">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative h-20 w-16 shrink-0 border border-[#E5DFD5] bg-[#F2EDE6] p-1.5">
                  {item.variant?.perfume?.imageUrl && (
                    <Image
                      src={item.variant.perfume.imageUrl}
                      alt={item.perfumeName}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-serif text-xl text-[#161616]">
                    {item.perfumeName}
                  </p>
                  <p className="text-xs text-[#6B655E]">
                    Format {item.volumeMl} ml × {item.quantity}
                  </p>
                </div>

                <span className="text-sm font-medium tabular-nums text-[#161616]">
                  {formatPrice(item.unitPriceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 border-t border-[#E5DFD5] pt-5 text-sm">
            <div className="flex justify-between text-[#6B655E]">
              <span>Sous-total</span>
              <span>{formatPrice(order.subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-[#6B655E]">
              <span>Livraison</span>
              <span>
                {order.shippingCents === 0
                  ? "Offerte"
                  : formatPrice(order.shippingCents)}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t border-[#E5DFD5] pt-3">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#161616]">
                Total réglé
              </span>
              <span className="font-serif text-2xl font-medium text-[#161616]">
                {formatPrice(order.totalCents)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Gift Note */}
        <div className="space-y-6 md:col-span-5">
          <div className="border border-[#E5DFD5] bg-[#F2EDE6]/60 p-6">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#161616]">
              <MapPin className="h-4 w-4 text-[#A68352]" />
              <span>Lieu de livraison</span>
            </div>

            <div className="mt-4 space-y-1 text-sm leading-relaxed text-[#6B655E]">
              <p className="font-medium text-[#161616]">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingPostalCode} {order.shippingCity}
              </p>
              <p>{order.shippingCountry}</p>
              <p className="pt-2 text-xs">{order.customerPhone}</p>
            </div>
          </div>

          {order.giftNote && (
            <div className="border border-[#E5DFD5] bg-[#FFFDF9] p-6">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#161616]">
                <Gift className="h-4 w-4 text-[#A68352]" />
                <span>Message calligraphié</span>
              </div>
              <p className="mt-3 font-serif text-base italic leading-relaxed text-[#161616]">
                « {order.giftNote} »
              </p>
            </div>
          )}

          <div className="border border-[#E5DFD5] bg-[#FAF8F5] p-6 text-xs leading-relaxed text-[#6B655E]">
            Une question sur votre commande ? Notre conciergerie vous répond à{" "}
            <span className="text-[#161616]">{BRAND_CONFIG.contactEmail}</span>.
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Button asChild variant="primary">
          <Link href="/">Retourner à la Maison {BRAND_CONFIG.name}</Link>
        </Button>
      </div>
    </div>
  );
}
