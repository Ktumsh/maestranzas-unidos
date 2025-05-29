import { NextResponse } from "next/server";

import { getAllPurchaseOrders } from "@/db/querys/purchase-orders-querys";

export async function GET() {
  try {
    const data = await getAllPurchaseOrders();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener órdenes de compra:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
