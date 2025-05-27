"use server";

import { eq } from "drizzle-orm";

import { db } from "../db";
import { parts, stockAlerts } from "../schema";

export async function getLowStockAlerts() {
  try {
    const result = await db
      .select({
        id: stockAlerts.id,
        partId: stockAlerts.partId,
        stock: stockAlerts.stock,
        minStock: stockAlerts.minStock,
        createdAt: stockAlerts.createdAt,
        part: parts,
      })
      .from(stockAlerts)
      .leftJoin(parts, eq(stockAlerts.partId, parts.id));

    return result;
  } catch (error) {
    console.error("Error al obtener alertas de stock bajo:", error);
    throw error;
  }
}
