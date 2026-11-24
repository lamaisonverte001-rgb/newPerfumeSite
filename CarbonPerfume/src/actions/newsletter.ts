"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";

export interface ActionResponse {
  ok: boolean;
  message: string;
  alreadySubscribed?: boolean;
}

export async function subscribeNewsletterAction(
  rawEmail: string
): Promise<ActionResponse> {
  const parsed = newsletterSchema.safeParse({ email: rawEmail });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      message: firstIssue?.message ?? "Adresse email invalide.",
    };
  }

  const normalizedEmail = parsed.data.email.toLowerCase();

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return {
        ok: true,
        alreadySubscribed: true,
        message:
          "Cette adresse fait déjà partie du Cercle Privé Carbon Perfume.",
      };
    }

    await prisma.newsletterSubscriber.create({
      data: { email: normalizedEmail },
    });

    revalidatePath("/admin");

    return {
      ok: true,
      message:
        "Bienvenue dans le Cercle Carbon Perfume. Vos invitations privées vous seront adressées en avant-première.",
    };
  } catch {
    return {
      ok: false,
      message:
        "Une erreur technique est survenue lors de l'enregistrement. Veuillez réessayer.",
    };
  }
}
