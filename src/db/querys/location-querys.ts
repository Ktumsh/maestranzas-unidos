"use server";

import { eq } from "drizzle-orm";

import { db } from "../db";
import { requireRole } from "../restriction";
import { locations, activityLog, type Location } from "../schema";

export async function getAllLocations(): Promise<Location[]> {
  try {
    return await db.select().from(locations);
  } catch (error) {
    console.error("Error al obtener ubicaciones:", error);
    throw error;
  }
}

export async function getLocationById(
  id: string,
): Promise<Location | undefined> {
  try {
    const [result] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id));
    return result;
  } catch (error) {
    console.error("Error al obtener ubicación por ID:", error);
    throw error;
  }
}

export async function createLocation(
  data: Omit<Location, "id" | "createdAt">,
): Promise<Location> {
  try {
    const admin = await requireRole(["admin"]);

    const [newLocation] = await db.insert(locations).values(data).returning();

    await db.insert(activityLog).values({
      userId: admin.id,
      action: `Registró una nueva ubicación (${data.warehouse} - ${data.shelf})`,
      entityType: "location",
      entityId: newLocation.id,
    });

    return newLocation;
  } catch (error) {
    console.error("Error al crear ubicación:", error);
    throw error;
  }
}

export async function deleteLocationById(id: string) {
  try {
    const admin = await requireRole(["admin"]);

    await db.delete(locations).where(eq(locations.id, id));

    await db.insert(activityLog).values({
      userId: admin.id,
      action: `Eliminó la ubicación con ID ${id}`,
      entityType: "location",
      entityId: id,
    });
  } catch (error) {
    console.error("Error al eliminar ubicación:", error);
    throw error;
  }
}
