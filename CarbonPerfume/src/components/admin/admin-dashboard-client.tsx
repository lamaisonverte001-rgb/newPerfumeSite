"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { LogOut, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { PerfumeDTO, PerfumeVariantDTO } from "@/types/perfume";
import {
  logoutAdminAction,
  updateOrderStatusAction,
  updatePerfumeVariantAction,
} from "@/actions/admin";
import { orderStatusValues } from "@/lib/validations";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface AdminOrderDTO {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingCity: string;
  shippingCountry: string;
  giftNote: string | null;
  totalCents: number;
  status: string;
  createdAtIso: string;
  items: {
    id: string;
    perfumeName: string;
    volumeMl: number;
    quantity: number;
    unitPriceCents: number;
  }[];
}

export interface AdminSubscriberDTO {
  id: string;
  email: string;
  createdAtIso: string;
}

const STATUS_BADGE_STYLES: Record<string, string> = {
  PENDING: "border-[#A68352]/40 bg-[#F2EDE6] text-[#6B655E]",
  PAID: "border-[#2F5D46]/40 bg-[#2F5D46]/10 text-[#2F5D46]",
  PREPARING: "border-[#A68352] bg-[#A68352]/15 text-[#8E6E42]",
  SHIPPED: "border-[#161616] bg-[#161616] text-[#FAF8F5]",
  CANCELLED: "border-[#9B2C2C]/40 bg-[#9B2C2C]/10 text-[#9B2C2C]",
};

const STATUS_FR: Record<string, string> = {
  PENDING: "PENDING — En attente",
  PAID: "PAID — Payée",
  PREPARING: "PREPARING — En préparation",
  SHIPPED: "SHIPPED — Expédiée",
  CANCELLED: "CANCELLED — Annulée",
};

function VariantRowEditor({ variant }: { variant: PerfumeVariantDTO }) {
  const router = useRouter();
  const [priceEuros, setPriceEuros] = useState<string>(
    (variant.priceCents / 100).toString()
  );
  const [stock, setStock] = useState<string>(variant.stock.toString());
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    const parsedPrice = Number(priceEuros);
    const parsedStock = Number(stock);

    if (!Number.isFinite(parsedPrice) || !Number.isFinite(parsedStock)) {
      toast.error("Veuillez saisir un prix et un stock numériques valides.");
      return;
    }

    startTransition(async () => {
      const res = await updatePerfumeVariantAction(
        variant.id,
        parsedPrice,
        parsedStock
      );
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-12 items-center gap-3 border-t border-[#E5DFD5] py-3 text-xs">
      <div className="col-span-3 font-medium text-[#161616]">
        {variant.volumeMl} ml
        <span className="block text-[10px] font-normal text-[#6B655E]">
          {variant.sku}
        </span>
      </div>

      <div className="col-span-4">
        <label className="sr-only" htmlFor={`price-${variant.id}`}>
          Prix (€) pour {variant.sku}
        </label>
        <div className="relative">
          <input
            id={`price-${variant.id}`}
            type="number"
            min={1}
            step="0.5"
            value={priceEuros}
            onChange={(e) => setPriceEuros(e.target.value)}
            className="h-9 w-full border border-[#E5DFD5] bg-[#FFFDF9] px-2.5 pr-7 text-xs tabular-nums text-[#161616] focus:border-[#A68352] focus:outline-none"
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B655E]">
            €
          </span>
        </div>
      </div>

      <div className="col-span-3">
        <label className="sr-only" htmlFor={`stock-${variant.id}`}>
          Stock pour {variant.sku}
        </label>
        <input
          id={`stock-${variant.id}`}
          type="number"
          min={0}
          step={1}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className={cn(
            "h-9 w-full border bg-[#FFFDF9] px-2.5 text-xs tabular-nums focus:border-[#A68352] focus:outline-none",
            Number(stock) === 0
              ? "border-[#9B2C2C]/60 text-[#9B2C2C]"
              : "border-[#E5DFD5] text-[#161616]"
          )}
        />
      </div>

      <div className="col-span-2 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          title="Enregistrer dans PostgreSQL"
          className="inline-flex h-9 w-9 items-center justify-center border border-[#161616] bg-[#161616] text-[#FAF8F5] transition-colors hover:bg-[#A68352] hover:border-[#A68352] disabled:opacity-40 cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function AdminDashboardClient({
  orders,
  perfumes,
  subscribers,
}: {
  orders: AdminOrderDTO[];
  perfumes: PerfumeDTO[];
  subscribers: AdminSubscriberDTO[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const totalRevenueCents = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((acc, o) => acc + o.totalCents, 0);

  const totalUnitsInStock = perfumes.reduce(
    (acc, p) => acc + p.variants.reduce((sum, v) => sum + v.stock, 0),
    0
  );

  const handleStatusChange = (orderId: string, nextStatus: string) => {
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, nextStatus);
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleLogout = async () => {
    await logoutAdminAction();
    toast.success("Déconnexion effectuée.");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-24 sm:px-8 lg:px-12">
      {/* Top Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E5DFD5] pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-[#A68352]">
            Back-Office PostgreSQL
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[#161616]">
            Atelier d&apos;Administration
          </h1>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Se déconnecter</span>
        </Button>
      </div>

      {/* Key Figures */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-[#E5DFD5] bg-[#FFFDF9] p-5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B655E]">
            Chiffre d&apos;affaires net
          </span>
          <p className="mt-2 font-serif text-3xl text-[#161616]">
            {formatPrice(totalRevenueCents)}
          </p>
        </div>

        <div className="border border-[#E5DFD5] bg-[#FFFDF9] p-5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B655E]">
            Commandes reçues
          </span>
          <p className="mt-2 font-serif text-3xl text-[#161616]">
            {orders.length}
          </p>
        </div>

        <div className="border border-[#E5DFD5] bg-[#FFFDF9] p-5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B655E]">
            Flacons en stock total
          </span>
          <p className="mt-2 font-serif text-3xl text-[#161616]">
            {totalUnitsInStock}
          </p>
        </div>

        <div className="border border-[#E5DFD5] bg-[#FFFDF9] p-5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B655E]">
            Inscrits Newsletter
          </span>
          <p className="mt-2 font-serif text-3xl text-[#161616]">
            {subscribers.length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="orders" className="mt-10">
        <Tabs.List
          aria-label="Sections du back-office"
          className="flex flex-wrap gap-2 border-b border-[#E5DFD5] pb-4"
        >
          <Tabs.Trigger
            value="orders"
            className="border border-transparent px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-[#6B655E] transition-colors data-[state=active]:border-[#161616] data-[state=active]:bg-[#161616] data-[state=active]:text-[#FAF8F5] cursor-pointer"
          >
            Commandes ({orders.length})
          </Tabs.Trigger>
          <Tabs.Trigger
            value="catalog"
            className="border border-transparent px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-[#6B655E] transition-colors data-[state=active]:border-[#161616] data-[state=active]:bg-[#161616] data-[state=active]:text-[#FAF8F5] cursor-pointer"
          >
            Catalogue &amp; Stocks ({perfumes.length})
          </Tabs.Trigger>
          <Tabs.Trigger
            value="newsletter"
            className="border border-transparent px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-[#6B655E] transition-colors data-[state=active]:border-[#161616] data-[state=active]:bg-[#161616] data-[state=active]:text-[#FAF8F5] cursor-pointer"
          >
            Newsletter ({subscribers.length})
          </Tabs.Trigger>
        </Tabs.List>

        {/* TAB 1: ORDERS */}
        <Tabs.Content value="orders" className="mt-8 focus:outline-none">
          {orders.length === 0 ? (
            <div className="border border-[#E5DFD5] bg-[#F2EDE6]/45 p-12 text-center">
              <p className="font-serif text-2xl text-[#161616]">
                Aucune commande enregistrée pour l&apos;instant.
              </p>
              <p className="mt-2 text-xs text-[#6B655E]">
                Les commandes passées sur /checkout apparaissent immédiatement ici.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#E5DFD5] bg-[#FFFDF9]">
              <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5DFD5] bg-[#F2EDE6]/70 text-[10px] uppercase tracking-[0.18em] text-[#6B655E]">
                    <th className="px-4 py-3.5">Commande</th>
                    <th className="px-4 py-3.5">Client &amp; Destination</th>
                    <th className="px-4 py-3.5">Articles</th>
                    <th className="px-4 py-3.5">Total TTC</th>
                    <th className="px-4 py-3.5">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD5]">
                  {orders.map((order) => (
                    <tr key={order.id} className="align-top">
                      <td className="px-4 py-4">
                        <Link
                          href={`/commande/${order.orderNumber}`}
                          className="inline-flex items-center gap-1 font-medium text-[#161616] hover:text-[#A68352]"
                        >
                          <span>{order.orderNumber}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                        <span className="mt-1 block text-[11px] text-[#6B655E]">
                          {new Intl.DateTimeFormat("fr-FR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          }).format(new Date(order.createdAtIso))}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium text-[#161616]">
                          {order.customerName}
                        </p>
                        <p className="text-[#6B655E]">{order.customerEmail}</p>
                        <p className="text-[11px] text-[#6B655E]">
                          {order.shippingCity}, {order.shippingCountry}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <ul className="space-y-1">
                          {order.items.map((it) => (
                            <li key={it.id} className="text-[#161616]">
                              {it.quantity} × {it.perfumeName} ({it.volumeMl} ml)
                            </li>
                          ))}
                        </ul>
                        {order.giftNote && (
                          <p className="mt-1.5 italic text-[#A68352]">
                            Message : « {order.giftNote} »
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 font-serif text-lg font-medium tabular-nums text-[#161616]">
                        {formatPrice(order.totalCents)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <span
                            className={cn(
                              "inline-block w-fit border px-2 py-0.5 text-[10px] uppercase tracking-wider",
                              STATUS_BADGE_STYLES[order.status] ?? ""
                            )}
                          >
                            {order.status}
                          </span>
                          <select
                            aria-label={`Changer le statut de ${order.orderNumber}`}
                            value={order.status}
                            disabled={isPending}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="h-9 border border-[#E5DFD5] bg-[#FAF8F5] px-2.5 text-xs text-[#161616] focus:border-[#A68352] focus:outline-none"
                          >
                            {orderStatusValues.map((st) => (
                              <option key={st} value={st}>
                                {STATUS_FR[st] ?? st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Tabs.Content>

        {/* TAB 2: CATALOG & LIVE PRICE / STOCK */}
        <Tabs.Content value="catalog" className="mt-8 focus:outline-none">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {perfumes.map((perfume) => (
              <div
                key={perfume.id}
                className="border border-[#E5DFD5] bg-[#FFFDF9] p-5"
              >
                <div className="flex items-center gap-4 pb-4">
                  <div className="relative h-16 w-14 shrink-0 border border-[#E5DFD5] bg-[#F2EDE6] p-1">
                    <Image
                      src={perfume.imageUrl}
                      alt={perfume.name}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#A68352]">
                      {perfume.olfactoryFamily}
                    </span>
                    <h2 className="font-serif text-2xl text-[#161616]">
                      {perfume.name}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3 pb-2 text-[10px] uppercase tracking-[0.16em] text-[#6B655E]">
                  <span className="col-span-3">Format</span>
                  <span className="col-span-4">Prix TTC</span>
                  <span className="col-span-3">Stock</span>
                  <span className="col-span-2 text-right">Action</span>
                </div>

                {perfume.variants.map((variant) => (
                  <VariantRowEditor key={variant.id} variant={variant} />
                ))}
              </div>
            ))}
          </div>
        </Tabs.Content>

        {/* TAB 3: NEWSLETTER SUBSCRIBERS */}
        <Tabs.Content value="newsletter" className="mt-8 focus:outline-none">
          {subscribers.length === 0 ? (
            <div className="border border-[#E5DFD5] bg-[#F2EDE6]/45 p-12 text-center">
              <p className="font-serif text-2xl text-[#161616]">
                Aucun inscrit à la newsletter pour le moment.
              </p>
            </div>
          ) : (
            <div className="border border-[#E5DFD5] bg-[#FFFDF9]">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5DFD5] bg-[#F2EDE6]/70 text-[10px] uppercase tracking-[0.18em] text-[#6B655E]">
                    <th className="px-6 py-3.5">Adresse email</th>
                    <th className="px-6 py-3.5">Date d&apos;inscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD5]">
                  {subscribers.map((sub) => (
                    <tr key={sub.id}>
                      <td className="px-6 py-3.5 font-medium text-[#161616]">
                        {sub.email}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-[#6B655E]">
                        {new Intl.DateTimeFormat("fr-FR", {
                          dateStyle: "long",
                          timeStyle: "short",
                        }).format(new Date(sub.createdAtIso))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
