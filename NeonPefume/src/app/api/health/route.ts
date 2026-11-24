import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const perfumeCount = await prisma.perfume.count();
    return NextResponse.json({ status: "ok", perfumes: perfumeCount });
  } catch (error) {
    console.error("[GET /api/health]", error);
    return NextResponse.json(
      { status: "error", message: "Database unreachable" },
      { status: 503 }
    );
  }
}
