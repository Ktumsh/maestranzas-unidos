"use server";

import { and, eq, isNull, lt, not } from "drizzle-orm";

import { db } from "../db";
import { batchAlerts, partBatches, parts } from "../schema";

export async function checkExpiringBatches(days = 30) {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const expiringBatches = await db
      .select()
      .from(partBatches)

      .where(
        and(
          not(isNull(partBatches.expirationDate)),
          lt(partBatches.expirationDate, futureDate),
        ),
      );

    for (const batch of expiringBatches) {
      const alreadyAlerted = await db
        .select()
        .from(batchAlerts)
        .where(eq(batchAlerts.partBatchId, batch.id));

      if (alreadyAlerted.length === 0) {
        await db.insert(batchAlerts).values({
          partBatchId: batch.id,
          expirationDate: batch.expirationDate!,
          createdAt: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error al verificar lotes por vencer:", error);
    throw error;
  }
}

export async function getExpiringBatchAlerts() {
  try {
    return await db
      .select({
        id: batchAlerts.id,
        expirationDate: batchAlerts.expirationDate,
        createdAt: batchAlerts.createdAt,
        batchCode: partBatches.batchCode,
        serialNumber: parts.serialNumber,
        image: parts.image,
      })
      .from(batchAlerts)
      .leftJoin(partBatches, eq(batchAlerts.partBatchId, partBatches.id))
      .leftJoin(parts, eq(partBatches.partId, parts.id));
  } catch (error) {
    console.error("Error al obtener alertas de lotes por vencer:", error);
    throw error;
  }
}
