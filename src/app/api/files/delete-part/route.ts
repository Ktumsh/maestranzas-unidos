import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/app/auth/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json();

  if (!url) {
    return NextResponse.json(
      { error: "URL no proporcionada" },
      { status: 400 },
    );
  }

  try {
    await del(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar archivo:", error);
    return NextResponse.json(
      { error: "Error al eliminar archivo" },
      { status: 500 },
    );
  }
}
