import { NextResponse } from "next/server";

import { getAllSuppliers } from "@/db/querys/suppliers-querys";

export async function GET() {
  try {
    const allSuppliers = await getAllSuppliers();
    return NextResponse.json(allSuppliers);
  } catch (error) {
    console.error("Error al obtener proveedores desde la API:", error);
    return new NextResponse("Error interno al obtener proveedores", {
      status: 500,
    });
  }
}
