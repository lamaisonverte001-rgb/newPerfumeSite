import crypto from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createOrderApiSchema } from "@/lib/validations";
import { calculateShippingCents } from "@/lib/utils";
import { BRAND_CONFIG } from "@/config/brand";

class StockConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StockConflictError";
  }
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${BRAND_CONFIG.monogram}-${year}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = createOrderApiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Données de commande invalides.",
        },
        { status: 400 }
      );
    }

    const input = parsed.data;

    // Regroupe les quantités par variantId pour éviter les doublons
    const quantityByVariant = new Map<string, number>();
    for (const item of input.items) {
      quantityByVariant.set(
        item.variantId,
        (quantityByVariant.get(item.variantId) ?? 0) + item.quantity
      );
    }

    const variantIds = Array.from(quantityByVariant.keys());

    // Transaction atomique : contrôle stock + décrémentation conditionnelle + création commande
    const createdOrder = await prisma.$transaction(async (tx) => {
      const variants = await tx.perfumeVariant.findMany({
        where: { id: { in: variantIds } },
        include: { perfume: true },
      });

      if (variants.length !== variantIds.length) {
        throw new StockConflictError(
          "Un ou plusieurs articles de votre panier ne sont plus disponibles."
        );
      }

      const variantMap = new Map(variants.map((v) => [v.id, v]));

      let subtotalCents = 0;
      const orderItemsData: Array<{
        variantId: string;
        perfumeName: string;
        volumeMl: number;
        unitPriceCents: number;
        quantity: number;
      }> = [];

      for (const [variantId, quantity] of quantityByVariant.entries()) {
        const variant = variantMap.get(variantId);
        if (!variant) {
          throw new StockConflictError("Article introuvable.");
        }

        // Décrémentation atomique protégée contre les accès concurrents
        const updated = await tx.perfumeVariant.updateMany({
          where: {
            id: variantId,
            stock: { gte: quantity },
          },
          data: {
            stock: { decrement: quantity },
          },
        });

        if (updated.count === 0) {
          throw new StockConflictError(
            `Stock insuffisant pour ${variant.perfume.name} (${variant.volumeMl} ml). Disponible : ${variant.stock}.`
          );
        }

        subtotalCents += variant.priceCents * quantity;
        orderItemsData.push({
          variantId: variant.id,
          perfumeName: variant.perfume.name,
          volumeMl: variant.volumeMl,
          unitPriceCents: variant.priceCents,
          quantity,
        });
      }

      const shippingCents = calculateShippingCents(subtotalCents);
      const totalCents = subtotalCents + shippingCents;

      // Architecture prête pour Stripe : si STRIPE_SECRET_KEY est défini, statut initial PENDING avant webhook
      const initialStatus = process.env.STRIPE_SECRET_KEY ? "PENDING" : "PAID";

      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerName: input.customerName,
          customerEmail: input.customerEmail.toLowerCase(),
          customerPhone: input.customerPhone,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          shippingPostalCode: input.shippingPostalCode,
          shippingCountry: input.shippingCountry,
          giftNote: input.giftNote ? input.giftNote : null,
          subtotalCents,
          shippingCents,
          totalCents,
          status: initialStatus,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      return order;
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        orderNumber: createdOrder.orderNumber,
        orderId: createdOrder.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof StockConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("[POST /api/orders]", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement de la commande." },
      { status: 500 }
    );
  }
}
