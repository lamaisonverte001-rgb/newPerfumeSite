import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllPerfumes } from "@/lib/catalog";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import {
  AdminDashboardClient,
  type AdminOrderDTO,
  type AdminSubscriberDTO,
} from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <AdminLoginForm />;
  }

  const [orders, perfumes, subscribers] = await Promise.all([
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    getAllPerfumes(),
    prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const serializedOrders: AdminOrderDTO[] = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
  }));

  const serializedSubscribers: AdminSubscriberDTO[] = subscribers.map((sub) => ({
    ...sub,
    createdAt: sub.createdAt.toISOString(),
  }));

  return (
    <AdminDashboardClient
      initialOrders={serializedOrders}
      initialPerfumes={perfumes}
      subscribers={serializedSubscribers}
    />
  );
}
