"use server";

import { and, eq, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "../db";
import { type EmailSends, emailSends } from "../schema";

export type EmailSendsActionType =
  | "email_verification"
  | "password_recovery"
  | "email_change";

export async function deleteVerificationCode(
  code: string,
  actionType: EmailSendsActionType,
) {
  try {
    await db
      .delete(emailSends)
      .where(
        and(eq(emailSends.code, code), eq(emailSends.actionType, actionType)),
      );
  } catch (error) {
    console.error("Error al eliminar el code de verificación:", error);
    throw error;
  }
}

export async function insertEmailSendsCode(
  userId: string,
  code: string,
  actionType: EmailSendsActionType,
) {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  const token = nanoid(64);

  try {
    await db
      .delete(emailSends)
      .where(
        and(
          eq(emailSends.userId, userId),
          eq(emailSends.actionType, actionType),
        ),
      );

    const [created] = await db
      .insert(emailSends)
      .values({
        userId,
        code,
        token,
        actionType,
        expiresAt,
      })
      .returning({ token: emailSends.token });

    return created.token;
  } catch (error) {
    console.error("Error al insertar el código de verificación:", error);
    throw error;
  }
}

export async function updateEmailSends(
  userId: string,
  actionType: EmailSendsActionType,
): Promise<EmailSends | undefined> {
  try {
    const result = await db
      .update(emailSends)
      .set({ verifiedAt: new Date() })
      .where(
        and(
          eq(emailSends.userId, userId),
          eq(emailSends.actionType, actionType),
          isNull(emailSends.verifiedAt),
        ),
      )
      .returning();

    return result[0];
  } catch (error) {
    console.error("Error al marcar el correo como verificado:", error);
    throw error;
  }
}

export async function getVerificationCode(
  code: string,
  actionType: EmailSendsActionType,
): Promise<Array<EmailSends>> {
  try {
    return await db
      .select()
      .from(emailSends)
      .where(
        and(eq(emailSends.code, code), eq(emailSends.actionType, actionType)),
      )
      .limit(1);
  } catch (error) {
    console.error("Error al obtener el código de verificación:", error);
    throw new Error("Error interno al consultar el código de verificación.");
  }
}

export async function verifyResetToken(token: string) {
  try {
    const [record] = await db
      .select()
      .from(emailSends)
      .where(
        and(
          eq(emailSends.token, token),
          eq(emailSends.actionType, "password_recovery"),
        ),
      );

    if (!record) return null;

    if (new Date() > record.expiresAt) return null;

    return record;
  } catch (error) {
    console.error("Error al verificar el token:", error);
    throw error;
  }
}
