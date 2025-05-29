"use server";

import { and, eq } from "drizzle-orm";

import { db } from "../db";
import { partBatches, partMovements, parts } from "../schema";

export async function getAllPartBatches() {
  try {
    return await db
      .select({
        id: partBatches.id,
        batchCode: partBatches.batchCode,
        quantity: partBatches.quantity,
        expirationDate: partBatches.expirationDate,
        createdAt: partBatches.createdAt,
        part: {
          id: parts.id,
          serialNumber: parts.serialNumber,
          image: parts.image,
        },
      })
      .from(partBatches)
      .leftJoin(parts, eq(partBatches.partId, parts.id));
  } catch (error) {
    console.error("Error al obtener los lotes de partes:", error);
    throw error;
  }
}

export async function createPartBatch(data: {
  partId: string;
  batchCode: string;
  quantity: number;
  expirationDate?: Date;
}) {
  const { partId, batchCode, quantity } = data;

  try {
    await db.transaction(async (tx) => {
      const exists = await tx
        .select()
        .from(partBatches)
        .where(
          and(
            eq(partBatches.partId, partId),
            eq(partBatches.batchCode, batchCode),
          ),
        )
        .limit(1);

      if (exists.length > 0) {
        throw new Error("Ya existe un lote con ese código para esta pieza.");
      }

      await tx.insert(partBatches).values(data);

      const current = await tx
        .select({ stock: parts.stock })
        .from(parts)
        .where(eq(parts.id, partId))
        .limit(1);

      const currentStock = current[0]?.stock ?? 0;

      await tx
        .update(parts)
        .set({ stock: currentStock + quantity })
        .where(eq(parts.id, partId));

      await tx.insert(partMovements).values({
        partId,
        quantity,
        type: "entrada",
        reason: "Registro de lote",
        createdAt: new Date(),
      });
    });
  } catch (error) {
    console.error("Error al crear el lote de partes:", error);
    throw error;
  }
}

export async function updatePartBatch(
  id: string,
  data: {
    partId: string;
    batchCode: string;
    quantity: number;
    expirationDate?: Date;
  },
) {
  const { partId, batchCode, quantity, expirationDate } = data;

  try {
    await db.transaction(async (tx) => {
      const oldBatch = await tx
        .select({
          quantity: partBatches.quantity,
          partId: partBatches.partId,
        })
        .from(partBatches)
        .where(eq(partBatches.id, id))
        .limit(1);

      if (!oldBatch[0]) {
        throw new Error("Lote no encontrado.");
      }

      const oldQuantity = oldBatch[0].quantity;
      const oldPartId = oldBatch[0].partId;

      if (oldPartId !== partId) {
        const originalStock = await tx
          .select({ stock: parts.stock })
          .from(parts)
          .where(eq(parts.id, oldPartId))
          .limit(1);

        const original = originalStock[0]?.stock ?? 0;

        await tx
          .update(parts)
          .set({ stock: original - oldQuantity })
          .where(eq(parts.id, oldPartId));

        const newStock = await tx
          .select({ stock: parts.stock })
          .from(parts)
          .where(eq(parts.id, partId))
          .limit(1);

        const current = newStock[0]?.stock ?? 0;

        await tx
          .update(parts)
          .set({ stock: current + quantity })
          .where(eq(parts.id, partId));
      } else {
        // Si es la misma pieza, solo ajustamos el delta
        const stockChange = quantity - oldQuantity;

        const current = await tx
          .select({ stock: parts.stock })
          .from(parts)
          .where(eq(parts.id, partId))
          .limit(1);

        const updatedStock = current[0]?.stock ?? 0;

        await tx
          .update(parts)
          .set({ stock: updatedStock + stockChange })
          .where(eq(parts.id, partId));
      }

      await tx
        .update(partBatches)
        .set({
          batchCode,
          quantity,
          expirationDate,
          partId,
        })
        .where(eq(partBatches.id, id));

      await tx.insert(partMovements).values({
        partId,
        quantity,
        type: "ajuste",
        reason: "Edición de lote",
        createdAt: new Date(),
      });
    });
  } catch (error) {
    console.error("Error al actualizar lote:", error);
    throw error;
  }
}

export async function deletePartBatch(id: string) {
  try {
    return await db.delete(partBatches).where(eq(partBatches.id, id));
  } catch (error) {
    console.error("Error al eliminar el lote de partes:", error);
    throw error;
  }
}
