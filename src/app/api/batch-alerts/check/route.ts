import { NextResponse } from "next/server";

import { checkExpiringBatches } from "@/db/querys/batch-alerts-querys";
import { requireRole } from "@/db/restriction";

export async function POST() {
  const session = await requireRole(["admin"]);

  if (!session) {
    return NextResponse.json(
      { error: "No tienes permiso para realizar esta acción" },
      { status: 403 },
    );
  }

  try {
    await checkExpiringBatches(30);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al verificar alertas de lotes:", error);
    return NextResponse.json(
      { error: "Error al verificar alertas" },
      { status: 500 },
    );
  }
}
