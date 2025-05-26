"use client";

import { permissionsByRole, type PermissionKey } from "@/db/permissions";
import { useUser } from "@/hooks/use-user";

export function usePermissions() {
  const { user } = useUser();

  function can(permission: PermissionKey): boolean {
    if (!user?.role) return false;
    return permissionsByRole[user.role]?.includes(permission) ?? false;
  }

  return { can };
}
