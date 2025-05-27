"use server";

import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { requireRole } from "../restriction";
import {
  activityLog,
  partMovements,
  parts,
  stockAlerts,
  users,
} from "../schema";

interface RegisterPartMovementData {
  partId: string;
  type: "entrada" | "salida" | "transferencia" | "uso_en_proyecto";
  quantity: number;
  reason: string;
}

export async function registerPartMovement(data: RegisterPartMovementData) {
  try {
    const user = await requireRole(["admin", "bodega", "compras"]);

    const [movement] = await db
      .insert(partMovements)
      .values({
        partId: data.partId,
        type: data.type,
        reason: data.reason,
        quantity: data.quantity,
        userId: user.id,
      })
      .returning();

    await db.insert(activityLog).values({
      userId: user.id,
      action: `Registró una ${data.type} (${data.quantity}) para la pieza ${data.partId}`,
      entityType: "part_movement",
      entityId: movement.id,
    });

    await db
      .update(parts)
      .set({
        stock:
          data.type === "salida"
            ? sql`${parts.stock} - ${data.quantity}`
            : sql`${parts.stock} + ${data.quantity}`,
      })
      .where(eq(parts.id, data.partId));

    const [part] = await db
      .select()
      .from(parts)
      .where(eq(parts.id, data.partId));
    if (part && part.stock < part.minStock) {
      await db.insert(stockAlerts).values({
        partId: part.id,
        stock: part.stock,
        minStock: part.minStock,
      });
    }

    return movement;
  } catch (error) {
    console.error("Error al registrar movimiento de pieza:", error);
    throw error;
  }
}

export async function getAllPartMovements() {
  try {
    await requireRole(["admin", "bodega", "compras"]);

    const result = await db
      .select({
        id: partMovements.id,
        partId: partMovements.partId,
        quantity: partMovements.quantity,
        type: partMovements.type,
        reason: partMovements.reason,
        createdAt: partMovements.createdAt,
        serialNumber: parts.serialNumber,
        userEmail: users.email,
      })
      .from(partMovements)
      .leftJoin(parts, eq(partMovements.partId, parts.id))
      .leftJoin(users, eq(partMovements.userId, users.id));

    return result;
  } catch (error) {
    console.error("Error al obtener movimientos de piezas:", error);
    throw error;
  }
}
