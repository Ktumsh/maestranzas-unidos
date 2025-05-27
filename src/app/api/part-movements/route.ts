import { NextResponse } from "next/server";

import { getAllPartMovements } from "@/db/querys/part-movements-querys";

export async function GET() {
  try {
    const movements = await getAllPartMovements();
    return NextResponse.json(movements);
  } catch (error) {
    console.error("Error en GET /api/part-movements:", error);
    return new NextResponse("Error al obtener movimientos", { status: 500 });
  }
}
