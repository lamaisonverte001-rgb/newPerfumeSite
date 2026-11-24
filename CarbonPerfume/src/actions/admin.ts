"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  isAdminAuthenticated,
} from "@/lib/auth";
import {
  adminLoginSchema,
  updateOrderStatusSchema,
  updateVariantSchema,
} from "@/lib/validations";

export interface AdminActionResult {
  ok: boolean;
  message: string;
}

export async function loginAdminAction(
  password: string
): Promise<AdminActionResult> {
  const parsed = adminLoginSchema.safeParse({ password });
  if (!parsed.success) {
    return { ok: false, message: "Mot de passe requis." };
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || "carbon-atelier-2026";
  const inputHash = crypto
    .createHash("sha256")
    .update(parsed.data.password)
    .digest();
  const expectedHash = crypto
    .createHash("sha256")
    .update(expectedPassword)
    .digest();

  if (!crypto.timingSafeEqual(inputHash, expectedHash)) {
    return {
      ok: false,
      message: "Mot de passe administrateur incorrect.",
    };
  }

  const token = createAdminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https") === true,
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  revalidatePath("/admin");
  return { ok: true, message: "Connexion réussie à l'Atelier d'Administration." };
}

export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  revalidatePath("/admin");
}

export async function updateOrderStatusAction(
  orderId: string,
  status: string
): Promise<AdminActionResult> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Session expirée. Veuillez vous reconnecter." };
  }

  const parsed = updateOrderStatusSchema.safeParse({ orderId, status });
  if (!parsed.success) {
    return { ok: false, message: "Statut de commande invalide." };
  }

  try {
    const order = await prisma.order.update({
      where: { id: parsed.data.orderId },
      data: { status: parsed.data.status },
    });

    revalidatePath("/admin");
    revalidatePath(`/commande/${order.orderNumber}`);

    return {
      ok: true,
      message: `Statut de la commande ${order.orderNumber} mis à jour.`,
    };
  } catch {
    return {
      ok: false,
      message: "Impossible de mettre à jour cette commande.",
    };
  }
}

export async function updatePerfumeVariantAction(
  variantId: string,
  priceEuros: number,
  stock: number
): Promise<AdminActionResult> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Session expirée. Veuillez vous reconnecter." };
  }

  const parsed = updateVariantSchema.safeParse({
    variantId,
    priceEuros,
    stock,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      message: firstIssue?.message ?? "Valeurs de variante invalides.",
    };
  }

  try {
    const updated = await prisma.perfumeVariant.update({
      where: { id: parsed.data.variantId },
      data: {
        priceCents: Math.round(parsed.data.priceEuros * 100),
        stock: parsed.data.stock,
      },
      include: {
        perfume: { select: { name: true, slug: true } },
      },
    });

    revalidatePath("/");
    revalidatePath(`/parfums/${updated.perfume.slug}`);
    revalidatePath("/admin");

    return {
      ok: true,
      message: `${updated.perfume.name} (${updated.volumeMl} ml) enregistré en base.`,
    };
  } catch {
    return {
      ok: false,
      message: "Erreur lors de la mise à jour du flacon.",
    };
  }
}
