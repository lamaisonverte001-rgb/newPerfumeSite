import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllPerfumes } from "@/lib/queries";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import {
  AdminDashboardClient,
  type AdminOrderDTO,
  type AdminSubscriberDTO,
} from "@/components/admin/admin-dashboard-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Atelier d'Administration",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <AdminLoginForm />;
  }

  const [ordersRaw, perfumes, subscribersRaw] = await Promise.all([
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    getAllPerfumes(),
    prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const orders: AdminOrderDTO[] = ordersRaw.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    shippingCity: o.shippingCity,
    shippingCountry: o.shippingCountry,
    giftNote: o.giftNote,
    totalCents: o.totalCents,
    status: o.status,
    createdAtIso: o.createdAt.toISOString(),
    items: o.items.map((it) => ({
      id: it.id,
      perfumeName: it.perfumeName,
      volumeMl: it.volumeMl,
      quantity: it.quantity,
      unitPriceCents: it.unitPriceCents,
    })),
  }));

  const subscribers: AdminSubscriberDTO[] = subscribersRaw.map((s) => ({
    id: s.id,
    email: s.email,
    createdAtIso: s.createdAt.toISOString(),
  }));

  return (
    <AdminDashboardClient
      orders={orders}
      perfumes={perfumes}
      subscribers={subscribers}
    />
  );
}
