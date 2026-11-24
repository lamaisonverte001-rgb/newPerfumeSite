"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, LogOut, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ORDER_STATUS_META,
  type OrderStatusKey,
  cn,
  formatPrice,
} from "@/lib/utils";
import type { PerfumeWithVariants } from "@/types/perfume";

export interface AdminOrderDTO {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  giftNote: string | null;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  status: OrderStatusKey;
  createdAt: string;
  items: Array<{
    id: string;
    perfumeName: string;
    volumeMl: number;
    unitPriceCents: number;
    quantity: number;
  }>;
}

export interface AdminSubscriberDTO {
  id: string;
  email: string;
  createdAt: string;
}

interface AdminDashboardClientProps {
  initialOrders: AdminOrderDTO[];
  initialPerfumes: PerfumeWithVariants[];
  subscribers: AdminSubscriberDTO[];
}

const ALL_STATUSES: OrderStatusKey[] = [
  "PENDING",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "CANCELLED",
];

export function AdminDashboardClient({
  initialOrders,
  initialPerfumes,
  subscribers,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrderDTO[]>(initialOrders);
  const [perfumes, setPerfumes] =
    useState<PerfumeWithVariants[]>(initialPerfumes);

  const [variantDrafts, setVariantDrafts] = useState<
    Record<string, { priceEuros: string; stock: string }>
  >(() => {
    const initial: Record<string, { priceEuros: string; stock: string }> = {};
    for (const perfume of initialPerfumes) {
      for (const variant of perfume.variants) {
        initial[variant.id] = {
          priceEuros: (variant.priceCents / 100).toString(),
          stock: variant.stock.toString(),
        };
      }
    }
    return initial;
  });

  const [savingVariantId, setSavingVariantId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const totalRevenueCents = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalCents, 0);

  const totalStockUnits = perfumes.reduce(
    (sum, p) => sum + p.variants.reduce((acc, v) => acc + v.stock, 0),
    0
  );

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Déconnexion effectuée.");
    router.refresh();
  }

  async function handleStatusChange(orderId: string, nextStatus: OrderStatusKey) {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        toast.error("Impossible de modifier le statut.");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: nextStatus } : order
        )
      );
      toast.success("Statut de commande mis à jour.");
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function handleSaveVariant(variantId: string) {
    const draft = variantDrafts[variantId];
    if (!draft) return;

    const parsedEuros = Number(draft.priceEuros.replace(",", "."));
    const parsedStock = Number.parseInt(draft.stock, 10);

    if (
      !Number.isFinite(parsedEuros) ||
      parsedEuros < 10 ||
      !Number.isInteger(parsedStock) ||
      parsedStock < 0
    ) {
      toast.error("Veuillez indiquer un prix (>= 10 €) et un stock valides.");
      return;
    }

    const priceCents = Math.round(parsedEuros * 100);
    setSavingVariantId(variantId);

    try {
      const res = await fetch(`/api/admin/variants/${variantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceCents, stock: parsedStock }),
      });

      if (!res.ok) {
        toast.error("Erreur lors de la sauvegarde.");
        return;
      }

      setPerfumes((prev) =>
        prev.map((p) => ({
          ...p,
          variants: p.variants.map((v) =>
            v.id === variantId
              ? { ...v, priceCents, stock: parsedStock }
              : v
          ),
        }))
      );
      toast.success("Prix et stock enregistrés en base PostgreSQL.");
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setSavingVariantId(null);
    }
  }

  function handleExportSubscribersCsv() {
    const lines = [
      "email,date_inscription",
      ...subscribers.map(
        (s) => `${s.email},${new Date(s.createdAt).toISOString()}`
      ),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "newsletter-inscrits.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 pb-24 lg:px-10 lg:pt-36">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-6 border-b border-[#E5DFD5] pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#A68352]">
            Back-Office · PostgreSQL Temps Réel
          </p>
          <h1 className="mt-2 font-serif text-4xl font-light text-[#161616]">
            Atelier Administration
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Voir la Boutique</Link>
          </Button>
          <Button variant="subtle" size="sm" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Synthèse indicateurs */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Chiffre d'affaires", value: formatPrice(totalRevenueCents) },
          { label: "Commandes", value: orders.length.toString() },
          { label: "Flacons en stock", value: totalStockUnits.toString() },
          { label: "Inscrits Newsletter", value: subscribers.length.toString() },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="border border-[#E5DFD5] bg-[#F2EDE6]/60 p-5"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#6B655E]">
              {kpi.label}
            </p>
            <p className="mt-2 font-serif text-3xl font-light text-[#161616]">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Onglets principaux */}
      <Tabs defaultValue="orders" className="mt-10">
        <TabsList>
          <TabsTrigger value="orders">
            Commandes ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="catalog">
            Catalogue &amp; Stocks ({perfumes.length})
          </TabsTrigger>
          <TabsTrigger value="newsletter">
            Newsletter ({subscribers.length})
          </TabsTrigger>
        </TabsList>

        {/* Onglet Commandes */}
        <TabsContent value="orders">
          {orders.length === 0 ? (
            <div className="border border-[#E5DFD5] bg-[#F2EDE6]/40 p-12 text-center">
              <p className="font-serif text-2xl text-[#161616]">
                Aucune commande enregistrée pour l&apos;instant.
              </p>
              <p className="mt-2 text-xs text-[#6B655E]">
                Les commandes validées via le tunnel de paiement apparaîtront
                ici instantanément.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusMeta = ORDER_STATUS_META[order.status];
                return (
                  <div
                    key={order.id}
                    className="border border-[#E5DFD5] bg-[#FAF8F5] p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 border-b border-[#E5DFD5] pb-4 lg:flex-row lg:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <Link
                            href={`/commande/${order.orderNumber}`}
                            className="font-serif text-2xl text-[#161616] hover:text-[#A68352] transition-colors"
                          >
                            {order.orderNumber}
                          </Link>
                          <span
                            className={cn(
                              "border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]",
                              statusMeta.className
                            )}
                          >
                            {statusMeta.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#6B655E]">
                          {new Intl.DateTimeFormat("fr-FR", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(order.createdAt))}{" "}
                          · {order.customerName} ({order.customerEmail})
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-serif text-2xl text-[#161616]">
                          {formatPrice(order.totalCents)}
                        </span>

                        <label className="sr-only" htmlFor={`status-${order.id}`}>
                          Changer le statut
                        </label>
                        <select
                          id={`status-${order.id}`}
                          value={order.status}
                          disabled={updatingOrderId === order.id}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatusKey
                            )
                          }
                          className="h-10 border border-[#E5DFD5] bg-[#F2EDE6] px-3 text-xs uppercase tracking-[0.14em] text-[#161616] focus:border-[#A68352] focus:outline-none cursor-pointer"
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {ORDER_STATUS_META[st].label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 text-xs text-[#6B655E] md:grid-cols-2">
                      <div>
                        <p className="font-medium uppercase tracking-[0.16em] text-[#161616]">
                          Articles
                        </p>
                        <ul className="mt-2 space-y-1">
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.quantity} × {item.perfumeName} ({item.volumeMl}{" "}
                              ml) — {formatPrice(item.unitPriceCents * item.quantity)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium uppercase tracking-[0.16em] text-[#161616]">
                          Livraison
                        </p>
                        <p className="mt-2">
                          {order.shippingAddress}, {order.shippingPostalCode}{" "}
                          {order.shippingCity}, {order.shippingCountry}
                        </p>
                        {order.giftNote && (
                          <p className="mt-1.5 italic text-[#A68352]">
                            Message cadeau : « {order.giftNote} »
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Onglet Catalogue & Stocks */}
        <TabsContent value="catalog">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {perfumes.map((perfume) => (
              <div
                key={perfume.id}
                className="border border-[#E5DFD5] bg-[#FAF8F5] p-6"
              >
                <div className="flex items-center gap-4 border-b border-[#E5DFD5] pb-4">
                  <div className="relative h-16 w-14 shrink-0 border border-[#E5DFD5] bg-[#F2EDE6]">
                    <Image
                      src={perfume.imageUrl}
                      alt={perfume.name}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#A68352]">
                      {perfume.olfactoryFamily}
                    </p>
                    <h2 className="font-serif text-2xl text-[#161616]">
                      {perfume.name}
                    </h2>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {perfume.variants.map((variant) => {
                    const draft = variantDrafts[variant.id] ?? {
                      priceEuros: (variant.priceCents / 100).toString(),
                      stock: variant.stock.toString(),
                    };

                    return (
                      <div
                        key={variant.id}
                        className="flex flex-wrap items-end justify-between gap-3 border border-[#E5DFD5] bg-[#F2EDE6]/45 p-3.5"
                      >
                        <div className="min-w-[90px]">
                          <p className="text-xs font-medium text-[#161616]">
                            {variant.volumeMl} ml
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-[#6B655E]">
                            {variant.sku}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-end gap-3">
                          <div>
                            <label
                              htmlFor={`price-${variant.id}`}
                              className="block text-[10px] uppercase tracking-[0.16em] text-[#6B655E]"
                            >
                              Prix (€)
                            </label>
                            <input
                              id={`price-${variant.id}`}
                              type="number"
                              min={10}
                              step="1"
                              value={draft.priceEuros}
                              onChange={(e) =>
                                setVariantDrafts((prev) => ({
                                  ...prev,
                                  [variant.id]: {
                                    ...draft,
                                    priceEuros: e.target.value,
                                  },
                                }))
                              }
                              className="mt-1 h-9 w-24 border border-[#E5DFD5] bg-[#FAF8F5] px-2.5 text-xs text-[#161616] focus:border-[#A68352] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`stock-${variant.id}`}
                              className="block text-[10px] uppercase tracking-[0.16em] text-[#6B655E]"
                            >
                              Stock
                            </label>
                            <input
                              id={`stock-${variant.id}`}
                              type="number"
                              min={0}
                              step="1"
                              value={draft.stock}
                              onChange={(e) =>
                                setVariantDrafts((prev) => ({
                                  ...prev,
                                  [variant.id]: {
                                    ...draft,
                                    stock: e.target.value,
                                  },
                                }))
                              }
                              className="mt-1 h-9 w-20 border border-[#E5DFD5] bg-[#FAF8F5] px-2.5 text-xs text-[#161616] focus:border-[#A68352] focus:outline-none"
                            />
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            disabled={savingVariantId === variant.id}
                            onClick={() => handleSaveVariant(variant.id)}
                          >
                            <Save className="h-3.5 w-3.5" strokeWidth={1.5} />
                            {savingVariantId === variant.id
                              ? "..."
                              : "Enregistrer"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Newsletter */}
        <TabsContent value="newsletter">
          <div className="border border-[#E5DFD5] bg-[#FAF8F5] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5DFD5] pb-4">
              <h2 className="font-serif text-2xl text-[#161616]">
                Inscrits au Cercle Privé
              </h2>
              {subscribers.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExportSubscribersCsv}
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Exporter CSV
                </Button>
              )}
            </div>

            {subscribers.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#6B655E]">
                Aucun inscrit à la newsletter pour le moment.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E5DFD5] text-[10px] uppercase tracking-[0.2em] text-[#6B655E]">
                      <th className="py-3 pr-4">Adresse e-mail</th>
                      <th className="py-3 text-right">Date d&apos;inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFD5]">
                    {subscribers.map((sub) => (
                      <tr key={sub.id}>
                        <td className="py-3.5 pr-4 font-medium text-[#161616]">
                          {sub.email}
                        </td>
                        <td className="py-3.5 text-right text-[#6B655E]">
                          {new Intl.DateTimeFormat("fr-FR", {
                            dateStyle: "long",
                            timeStyle: "short",
                          }).format(new Date(sub.createdAt))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
