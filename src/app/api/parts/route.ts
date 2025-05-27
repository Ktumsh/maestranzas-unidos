import { NextResponse } from "next/server";

import { db } from "@/db/db";
import { parts } from "@/db/schema";

export async function GET() {
  try {
    const allParts = await db.select().from(parts);
    return NextResponse.json(allParts);
  } catch (error) {
    console.error("Error al obtener piezas desde la API:", error);
    return new NextResponse("Error interno al obtener piezas", {
      status: 500,
    });
  }
}
