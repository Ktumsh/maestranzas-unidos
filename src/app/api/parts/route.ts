import { NextResponse } from "next/server";

import { getAllParts } from "@/db/querys/parts-querys";

export async function GET() {
  try {
    const allParts = await getAllParts();
    return NextResponse.json(allParts);
  } catch (error) {
    console.error("Error al obtener piezas desde la API:", error);
    return new NextResponse("Error interno al obtener piezas", {
      status: 500,
    });
  }
}
