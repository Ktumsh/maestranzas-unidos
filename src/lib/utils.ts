import { genSaltSync, hashSync } from "bcrypt-ts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateHashedPassword(password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return hash;
}

export function getAvatarByRole(
  role: "admin" | "bodega" | "compras" = "compras",
) {
  const avatars = {
    admin: "/avatar/admin.webp",
    bodega: "/avatar/bodega.webp",
    compras: "/avatar/compras.webp",
  };
  return avatars[role] ?? "/avatar/compras.webp";
}
