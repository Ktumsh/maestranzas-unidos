import { NextResponse } from "next/server";

import { getExpiringBatchAlerts } from "@/db/querys/batch-alerts-querys";

export async function GET() {
  try {
    const alerts = await getExpiringBatchAlerts();
    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Error en /api/batch-alerts:", error);
    return new NextResponse("Error al obtener alertas de lotes", {
      status: 500,
    });
  }
}
