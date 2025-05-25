"use server";

import { compare } from "bcrypt-ts";
import { and, eq } from "drizzle-orm";

import { generateHashedPassword } from "@/lib/utils";

import { db } from "../db";
import { User, users } from "../schema";

interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export async function createUser({
  email,
  firstName,
  lastName,
  password,
}: CreateUserData): Promise<User> {
  const hashedPassword = generateHashedPassword(password);
  try {
    const [user] = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "bodega",
      })
      .returning();

    return user;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<User> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user;
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User> {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  } catch (error) {
    console.error("Error al obtener el usuario por email:", error);
    throw error;
  }
}

export async function getExistingEmail(email: string): Promise<boolean> {
  try {
    const [existingEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return !!existingEmail;
  } catch (error) {
    console.error("Error al obtener el email existente:", error);
    throw error;
  }
}

export async function updateUserEmail(id: string, email: string) {
  try {
    return await db.update(users).set({ email }).where(eq(users.id, id));
  } catch (error) {
    console.error("Error al actualizar el email del usuario:", error);
    throw error;
  }
}

export async function updateUserPassword(id: string, password: string) {
  const hashedPassword = generateHashedPassword(password);
  try {
    return await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, id));
  } catch (error) {
    console.error("Error al actualizar la contraseña del usuario:", error);
    throw error;
  }
}

export async function getAdminCount(): Promise<number> {
  try {
    const admins = await db
      .select()
      .from(users)
      .where(and(eq(users.role, "admin"), eq(users.status, "enabled")));
    return admins.length;
  } catch (error) {
    console.error("Error al obtener el conteo de administradores:", error);
    throw error;
  }
}

export async function deleteUser(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const userToDelete = await getUserById(id);
    if (!userToDelete) {
      return {
        success: false,
        error: "Usuario no encontrado.",
      };
    }

    if (userToDelete.role === "admin") {
      const adminCount = await getAdminCount();
      if (adminCount <= 1) {
        return {
          success: false,
          error: "No se puede eliminar el único administrador.",
        };
      }
    }

    await db.update(users).set({ status: "disabled" }).where(eq(users.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return { success: false, error: "Error al eliminar el usuario." };
  }
}

export async function getUserState(id: string): Promise<string> {
  try {
    const [userData] = await db
      .select({ status: users.status })
      .from(users)
      .where(eq(users.id, id));

    return userData.status;
  } catch (error) {
    console.error("Error al obtener el estado del usuario:", error);
    throw error;
  }
}

export async function verifySamePassword(
  userId: string,
  newPassword: string,
): Promise<boolean> {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  return await compare(newPassword, user.password);
}
