import { NextResponse } from "next/server";

import { getAllLocations } from "@/db/querys/location-querys";

export async function GET() {
  try {
    const locations = await getAllLocations();
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Error en API GET /api/locations:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
