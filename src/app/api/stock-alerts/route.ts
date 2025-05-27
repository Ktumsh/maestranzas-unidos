import { NextResponse } from "next/server";

import { getLowStockAlerts } from "@/db/querys/stock-alerts-querys";

export async function GET() {
  try {
    const alerts = await getLowStockAlerts();
    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Error al obtener alertas de stock bajo:", error);
    return new NextResponse("Error interno al obtener alertas", {
      status: 500,
    });
  }
}
