"use server";

import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { requireRole } from "../restriction";
import { activityLog, locations, parts, type Part } from "../schema";

interface CreatePartData {
  serialNumber: string;
  description: string;
  locationId: string;
}

export async function createPart(data: CreatePartData): Promise<Part> {
  try {
    const admin = await requireRole(["admin"]);

    const [newPart] = await db.insert(parts).values(data).returning();

    await db.insert(activityLog).values({
      userId: admin.id,
      action: `Registró una nueva pieza (${data.serialNumber})`,
      entityType: "part",
      entityId: newPart.id,
    });

    return newPart;
  } catch (error) {
    console.error("Error al crear pieza:", error);
    throw error;
  }
}

export async function deletePartById(id: string) {
  try {
    const admin = await requireRole(["admin"]);

    await db.delete(parts).where(eq(parts.id, id));

    await db.insert(activityLog).values({
      userId: admin.id,
      action: `Eliminó la pieza con ID ${id}`,
      entityType: "part",
      entityId: id,
    });
  } catch (error) {
    console.error("Error al eliminar pieza:", error);
    throw error;
  }
}

export async function updatePart(
  id: string,
  data: Partial<Omit<Part, "id" | "createdAt">>,
) {
  try {
    const admin = await requireRole(["admin"]);

    await db.update(parts).set(data).where(eq(parts.id, id));

    await db.insert(activityLog).values({
      userId: admin.id,
      action: `Actualizó la pieza con ID ${id}`,
      entityType: "part",
      entityId: id,
    });
  } catch (error) {
    console.error("Error al actualizar pieza:", error);
    throw error;
  }
}

export async function getAllParts(): Promise<
  Array<Part & { resolvedLocation: string }>
> {
  try {
    const result = await db
      .select({
        id: parts.id,
        serialNumber: parts.serialNumber,
        image: parts.image,
        description: parts.description,
        stock: parts.stock,
        minStock: parts.minStock,
        createdAt: parts.createdAt,
        locationId: parts.locationId,
        resolvedLocation:
          sql<string>`${locations.warehouse} || ' - Estantería ' || ${locations.shelf}`.as(
            "resolvedLocation",
          ),
      })
      .from(parts)
      .leftJoin(locations, eq(parts.locationId, locations.id));

    return result;
  } catch (error) {
    console.error("Error al obtener piezas:", error);
    throw error;
  }
}

export async function getPartById(id: string): Promise<Part | undefined> {
  try {
    const [result] = await db.select().from(parts).where(eq(parts.id, id));
    return result;
  } catch (error) {
    console.error("Error al obtener pieza por ID:", error);
    throw error;
  }
}
