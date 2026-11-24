import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        {
          message: "Vous faites déjà partie du cercle privé de la Maison.",
          alreadySubscribed: true,
        },
        { status: 200 }
      );
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json(
      {
        message: "Merci — bienvenue dans le cercle privé de la Maison.",
        alreadySubscribed: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/newsletter]", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer votre inscription pour le moment." },
      { status: 500 }
    );
  }
}
