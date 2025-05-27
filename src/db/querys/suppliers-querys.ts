"use server";

import { eq } from "drizzle-orm";

import { db } from "../db";
import { type Supplier, suppliers } from "../schema";

export async function createSupplier(data: {
  name: string;
  contactEmail: string;
  contactPhone: string;
}) {
  try {
    const [newSupplier] = await db.insert(suppliers).values(data).returning();
    return newSupplier;
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    throw error;
  }
}

export async function getSupplierById(
  id: string,
): Promise<Supplier | undefined> {
  try {
    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, id));
    return supplier;
  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    throw error;
  }
}

export async function updateSupplier(id: string, data: Partial<Supplier>) {
  try {
    await db.update(suppliers).set(data).where(eq(suppliers.id, id));
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    throw error;
  }
}

export async function deleteSupplierById(id: string) {
  try {
    await db.delete(suppliers).where(eq(suppliers.id, id));
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    throw error;
  }
}

export async function getAllSuppliers() {
  try {
    return await db.select().from(suppliers);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    throw error;
  }
}
