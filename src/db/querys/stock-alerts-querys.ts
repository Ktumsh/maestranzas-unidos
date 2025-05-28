"use server";

import { desc, eq } from "drizzle-orm";

import { db } from "../db";
import { locations, parts, stockAlerts } from "../schema";

export async function getLowStockAlerts() {
  try {
    const result = await db
      .select({
        id: stockAlerts.id,
        partId: stockAlerts.partId,
        stock: stockAlerts.stock,
        minStock: stockAlerts.minStock,
        createdAt: stockAlerts.createdAt,
        part: {
          id: parts.id,
          serialNumber: parts.serialNumber,
          description: parts.description,
          locationId: parts.locationId,
        },
        location: {
          warehouse: locations.warehouse,
          shelf: locations.shelf,
        },
      })
      .from(stockAlerts)
      .leftJoin(parts, eq(stockAlerts.partId, parts.id))
      .leftJoin(locations, eq(parts.locationId, locations.id))
      .orderBy(desc(stockAlerts.createdAt));

    return result;
  } catch (error) {
    console.error("Error al obtener alertas de stock bajo:", error);
    throw error;
  }
}
