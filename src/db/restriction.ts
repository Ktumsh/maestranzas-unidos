"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/app/auth/actions";

import type { UserRole } from "@/lib/types";

export async function requireRole(allowedRoles: Array<UserRole>) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Acceso no autorizado.");
  }

  return user;
}

export async function requireRoleForPage(allowedRoles: Array<UserRole>) {
  const user = await getCurrentUser();

  if (!user || !allowedRoles.includes(user.role)) {
    redirect("/");
  }

  return user;
}
