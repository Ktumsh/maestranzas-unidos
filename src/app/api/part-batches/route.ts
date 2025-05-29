import { NextResponse } from "next/server";

import { getAllPartBatches } from "@/db/querys/part-batches-querys";

export async function GET() {
  try {
    const batches = await getAllPartBatches();
    return NextResponse.json(batches);
  } catch (error) {
    console.error("Error al obtener lotes:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
