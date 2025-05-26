"use server";

import { eq } from "drizzle-orm";

import { generateHashedPassword } from "@/lib/utils";

import { db } from "../db";
import { requireRole } from "../restriction";
import { activityLog, type User, users } from "../schema";

import type { UserRole } from "@/lib/types";

interface CreateUserFromAdminData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}

export async function createUserFromAdmin(data: CreateUserFromAdminData) {
  try {
    const admin = await requireRole(["admin"]);

    const hashedPassword = generateHashedPassword(data.password);

    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashedPassword,
        role: data.role,
      })
      .returning();

    await db.insert(activityLog).values({
      userId: admin.id,
      action: `Creó un nuevo usuario (${newUser.email}) con rol ${newUser.role}`,
      entityType: "user",
      entityId: newUser.id,
    });

    return newUser;
  } catch (error) {
    console.error("Error al crear usuario desde el panel admin:", error);
    throw error;
  }
}

export async function deleteUserById(id: string) {
  try {
    const currentUser = await requireRole(["admin"]);

    if (currentUser.id === id) {
      throw new Error("No puedes eliminar tu propio usuario.");
    }

    await db.delete(users).where(eq(users.id, id));

    await db.insert(activityLog).values({
      userId: currentUser.id,
      action: `Eliminó al usuario con ID ${id}`,
      entityType: "user",
      entityId: id,
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
}

export async function updateUser(id: string, data: Partial<User>) {
  try {
    const admin = await requireRole(["admin"]);

    await db.update(users).set(data).where(eq(users.id, id));

    await db.insert(activityLog).values({
      userId: admin.id,
      action: `Actualizó al usuario con ID ${id}`,
      entityType: "user",
      entityId: id,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
}

export async function getAllUsers(): Promise<Array<User>> {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    throw error;
  }
}
