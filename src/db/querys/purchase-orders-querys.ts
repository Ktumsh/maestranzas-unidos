"use server";

import { eq } from "drizzle-orm";

import { PurchaseOrderFormData } from "@/lib/form-schemas";

import { db } from "../db";
import {
  partMovements,
  parts,
  purchaseOrderItems,
  purchaseOrders,
  suppliers,
} from "../schema";

export async function createPurchaseOrder(data: PurchaseOrderFormData) {
  try {
    const order = await db
      .insert(purchaseOrders)
      .values({
        supplierId: data.supplierId,
        notes: data.notes ?? null,
      })
      .returning({ id: purchaseOrders.id });

    const orderId = order[0].id;

    const items = data.items.map((item) => ({
      orderId,
      partId: item.partId,
      quantity: item.quantity,
    }));

    await db.insert(purchaseOrderItems).values(items);

    return order[0];
  } catch (error) {
    console.error("Error al crear la orden de compra:", error);
    throw error;
  }
}

export async function getAllPurchaseOrders() {
  try {
    const orders = await db
      .select()
      .from(purchaseOrders)
      .leftJoin(suppliers, eq(purchaseOrders.supplierId, suppliers.id));

    const items = await db
      .select({
        id: purchaseOrderItems.id,
        orderId: purchaseOrderItems.orderId,
        quantity: purchaseOrderItems.quantity,
        part: {
          id: parts.id,
          image: parts.image,
          serialNumber: parts.serialNumber,
        },
      })
      .from(purchaseOrderItems)
      .leftJoin(parts, eq(purchaseOrderItems.partId, parts.id));

    return orders.map((row) => ({
      ...row.purchase_orders,
      supplier: {
        name: row.suppliers?.name ?? "Desconocido",
      },
      items: items
        .filter((i) => i.orderId === row.purchase_orders.id)
        .map(({ id, orderId, quantity, part }) => ({
          id,
          orderId,
          quantity,
          part,
        })),
    }));
  } catch (error) {
    console.error("Error al obtener órdenes de compra:", error);
    throw error;
  }
}

export async function updatePurchaseOrderStatus(
  orderId: string,
  status: string,
) {
  try {
    const [current] = await db
      .select({ currentStatus: purchaseOrders.status })
      .from(purchaseOrders)
      .where(eq(purchaseOrders.id, orderId));

    if (!current) {
      throw new Error("Orden de compra no encontrada");
    }

    if (current.currentStatus === "recibida") {
      throw new Error("La orden ya ha sido recibida y no se puede modificar");
    }

    await db
      .update(purchaseOrders)
      .set({ status })
      .where(eq(purchaseOrders.id, orderId));

    if (status === "recibida" && current.currentStatus !== "recibida") {
      const items = await db
        .select({
          partId: purchaseOrderItems.partId,
          quantity: purchaseOrderItems.quantity,
        })
        .from(purchaseOrderItems)
        .where(eq(purchaseOrderItems.orderId, orderId));

      for (const item of items) {
        const [part] = await db
          .select({ stock: parts.stock })
          .from(parts)
          .where(eq(parts.id, item.partId));

        if (!part) continue;

        await db
          .update(parts)
          .set({ stock: part.stock + item.quantity })
          .where(eq(parts.id, item.partId));

        await db.insert(partMovements).values({
          partId: item.partId,
          quantity: item.quantity,
          type: "entrada",
          reason: "Recepción de orden de compra",
          supplierId: (
            await db
              .select({ supplierId: purchaseOrders.supplierId })
              .from(purchaseOrders)
              .where(eq(purchaseOrders.id, orderId))
          )[0]?.supplierId,
        });
      }
    }
  } catch (error) {
    console.error(
      "Error al actualizar el estado de la orden de compra:",
      error,
    );
    throw error;
  }
}

export async function deletePurchaseOrder(id: string) {
  try {
    await db.delete(purchaseOrders).where(eq(purchaseOrders.id, id));
  } catch (error) {
    console.error("Error al eliminar la orden de compra:", error);
    throw new Error("No se pudo eliminar la orden de compra");
  }
}
