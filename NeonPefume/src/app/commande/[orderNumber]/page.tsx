import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Gift, MapPin, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BRAND_CONFIG } from "@/config/brand";
import { ORDER_STATUS_META, cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

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

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const statusMeta = ORDER_STATUS_META[order.status];
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(order.createdAt);

  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-24 lg:px-10 lg:pt-36">
      <div className="border border-[#E5DFD5] bg-[#FAF8F5] p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#A68352] bg-[#F2EDE6] text-[#A68352]">
            <Check className="h-6 w-6" strokeWidth={1.5} />
          </div>

          <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
            Confirmation de commande · {BRAND_CONFIG.name}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-light text-[#161616] sm:text-5xl">
            Merci pour votre confiance
          </h1>
          <p className="mt-3 max-w-lg text-sm text-[#6B655E]">
            Votre commande <strong>{order.orderNumber}</strong> a bien été
            enregistrée le {formattedDate}. Notre atelier prépare votre écrin
            accompagné de deux échantillons offerts.
          </p>

          <span
            className={cn(
              "mt-5 inline-flex items-center gap-1.5 border px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
              statusMeta.className
            )}
          >
            <Package className="h-3.5 w-3.5" strokeWidth={1.5} />
            Statut : {statusMeta.label}
          </span>
        </div>

        {/* Détails client & livraison */}
        <div className="mt-10 grid grid-cols-1 gap-6 border-y border-[#E5DFD5] py-7 sm:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#6B655E]">
              <MapPin className="h-3.5 w-3.5 text-[#A68352]" strokeWidth={1.5} />
              Destinataire &amp; Livraison
            </h2>
            <p className="mt-3 text-sm font-medium text-[#161616]">
              {order.customerName}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#6B655E]">
              {order.shippingAddress}
              <br />
              {order.shippingPostalCode} {order.shippingCity}
              <br />
              {order.shippingCountry}
            </p>
            <p className="mt-2 text-xs text-[#6B655E]">
              {order.customerEmail} · {order.customerPhone}
            </p>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#6B655E]">
              <Gift className="h-3.5 w-3.5 text-[#A68352]" strokeWidth={1.5} />
              Attentions de la Maison
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-[#6B655E]">
              2 échantillons découverte offerts inclus dans votre colis.
            </p>
            {order.giftNote && (
              <blockquote className="mt-3 border-l-2 border-[#A68352] bg-[#F2EDE6]/75 px-4 py-3 font-serif text-base italic text-[#161616]">
                « {order.giftNote} »
              </blockquote>
            )}
          </div>
        </div>

        {/* Articles commandés */}
        <div className="mt-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#6B655E]">
            Flacons commandés
          </h2>

          <ul className="mt-4 divide-y divide-[#E5DFD5]">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-4 text-sm"
              >
                <div>
                  <p className="font-serif text-xl text-[#161616]">
                    {item.perfumeName}
                  </p>
                  <p className="text-xs text-[#6B655E]">
                    Parfum Intense {item.volumeMl} ml × {item.quantity} (
                    {formatPrice(item.unitPriceCents)} / unité)
                  </p>
                </div>
                <span className="font-serif text-lg text-[#161616]">
                  {formatPrice(item.unitPriceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 border-t border-[#E5DFD5] pt-5 text-xs text-[#6B655E]">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span className="text-[#161616]">
                {formatPrice(order.subtotalCents)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span className="text-[#161616]">
                {order.shippingCents === 0
                  ? "Offerte"
                  : formatPrice(order.shippingCents)}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#E5DFD5] pt-3 text-sm text-[#161616]">
              <span className="text-xs font-medium uppercase tracking-[0.18em]">
                Total réglé
              </span>
              <span className="font-serif text-2xl">
                {formatPrice(order.totalCents)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/">Retourner à la Boutique</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/#collection">Découvrir d&apos;autres créations</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
