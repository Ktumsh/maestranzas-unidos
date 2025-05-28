import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { auth } from "@/app/auth/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const maybeFile = formData.get("file");

  if (!(maybeFile instanceof Blob)) {
    return NextResponse.json(
      { error: "Debe enviar un archivo" },
      { status: 400 },
    );
  }
  const file = maybeFile as Blob & { name?: string };

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Máximo 5MB" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Solo JPEG, PNG o WEBP" },
      { status: 400 },
    );
  }

  const ext = file.name?.split(".").pop() ?? file.type.split("/")[1];
  const filePath = `parts/part-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const blob = await put(filePath, buffer, { access: "public" });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error al subir la imagen" },
      { status: 500 },
    );
  }
}
