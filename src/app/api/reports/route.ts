import { NextResponse } from "next/server";

import { getAllReports } from "@/db/querys/report-querys";

export async function GET() {
  try {
    const reports = await getAllReports();
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error al obtener los reportes:", error);
    return new NextResponse("Error interno al obtener los reportes", {
      status: 500,
    });
  }
}
