"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BRAND_CONFIG } from "@/config/brand";
import { generateOrderNumber } from "@/lib/utils";
import {
  createOrderServerSchema,
  type CreateOrderServerInput,
} from "@/lib/validations";

export interface CreateOrderResult {
  ok: boolean;
  orderNumber?: string;
  error?: string;
  paymentProvider?: "stripe_ready" | "simulated";
}

export async function createOrderAction(
  input: CreateOrderServerInput
): Promise<CreateOrderResult> {
  const parsed = createOrderServerSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      error: firstIssue?.message ?? "Données de commande invalides.",
    };
  }

  const data = parsed.data;

  // Consolidate duplicate variantIds if any
  const quantityByVariant = new Map<string, number>();
  for (const item of data.items) {
    quantityByVariant.set(
      item.variantId,
      (quantityByVariant.get(item.variantId) ?? 0) + item.quantity
    );
  }

  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY?.trim());

  try {
    const createdOrder = await prisma.$transaction(async (tx) => {
      const variantIds = Array.from(quantityByVariant.keys());
      const variants = await tx.perfumeVariant.findMany({
        where: { id: { in: variantIds } },
        include: { perfume: true },
      });

      if (variants.length !== variantIds.length) {
        throw new Error(
          "L'un des flacons sélectionnés n'est plus disponible au catalogue."
        );
      }

      let subtotalCents = 0;
      const orderItemsPayload: {
        variantId: string;
        perfumeName: string;
        volumeMl: number;
        unitPriceCents: number;
        quantity: number;
      }[] = [];

      for (const variant of variants) {
        const requestedQty = quantityByVariant.get(variant.id) ?? 0;
        if (variant.stock < requestedQty) {
          throw new Error(
            variant.stock === 0
              ? `Le flacon ${variant.perfume.name} (${variant.volumeMl} ml) est momentanément épuisé.`
              : `Stock insuffisant pour ${variant.perfume.name} (${variant.volumeMl} ml) : il ne reste que ${variant.stock} exemplaire(s).`
          );
        }

        const updated = await tx.perfumeVariant.updateMany({
          where: {
            id: variant.id,
            stock: { gte: requestedQty },
          },
          data: {
            stock: { decrement: requestedQty },
          },
        });

        if (updated.count !== 1) {
          throw new Error(
            `Le stock de ${variant.perfume.name} (${variant.volumeMl} ml) vient d'évoluer. Veuillez vérifier votre panier.`
          );
        }

        subtotalCents += variant.priceCents * requestedQty;
        orderItemsPayload.push({
          variantId: variant.id,
          perfumeName: variant.perfume.name,
          volumeMl: variant.volumeMl,
          unitPriceCents: variant.priceCents,
          quantity: requestedQty,
        });
      }

      const shippingCents =
        subtotalCents >= BRAND_CONFIG.freeShippingThresholdCents
          ? 0
          : BRAND_CONFIG.standardShippingCents;
      const totalCents = subtotalCents + shippingCents;

      let orderNumber = generateOrderNumber();
      for (let attempt = 0; attempt < 4; attempt += 1) {
        const collision = await tx.order.findUnique({
          where: { orderNumber },
          select: { id: true },
        });
        if (!collision) break;
        orderNumber = generateOrderNumber();
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: `${data.firstName} ${data.lastName}`.trim(),
          customerEmail: data.email.toLowerCase(),
          customerPhone: data.phone,
          shippingAddress: data.address,
          shippingCity: data.city,
          shippingPostalCode: data.postalCode,
          shippingCountry: data.country,
          giftNote: data.giftNote?.trim() ? data.giftNote.trim() : null,
          subtotalCents,
          shippingCents,
          totalCents,
          status: "PAID",
          items: {
            create: orderItemsPayload,
          },
        },
      });

      return order;
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      ok: true,
      orderNumber: createdOrder.orderNumber,
      paymentProvider: stripeConfigured ? "stripe_ready" : "simulated",
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Impossible de finaliser votre commande pour le moment.";
    return {
      ok: false,
      error: message,
    };
  }
}
