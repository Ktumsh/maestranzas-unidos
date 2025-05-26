import { NextResponse } from "next/server";

import { getAllUsers } from "@/db/querys/admin-querys";

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return new NextResponse("Error al obtener usuarios", { status: 500 });
  }
}
