import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateVariantSchema } from "@/lib/validations";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body: unknown = await request.json();
    const parsed = updateVariantSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Prix ou stock invalide." },
        { status: 400 }
      );
    }

    const updatedVariant = await prisma.perfumeVariant.update({
      where: { id },
      data: {
        priceCents: parsed.data.priceCents,
        stock: parsed.data.stock,
      },
      include: { perfume: true },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/parfums/${updatedVariant.perfume.slug}`);

    return NextResponse.json({ variant: updatedVariant });
  } catch (error) {
    console.error("[PATCH /api/admin/variants/[id]]", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour cette variante." },
      { status: 500 }
    );
  }
}
