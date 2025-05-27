"use client";

import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import {
  createUserFromAdmin,
  deleteUserById,
  updateUser,
} from "@/db/querys/admin-querys";
import { getUserByEmail } from "@/db/querys/user-querys";
import { requireRole } from "@/db/restriction";
import { fetcher } from "@/lib/fetcher";

import type { User } from "@/db/schema";
import type { UserFormData } from "@/lib/form-schemas";

export function useUsers() {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR<Array<User>>("/api/users", fetcher);

  const [userToView, setUserToView] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    delete: false,
  });

  const create = async (input: UserFormData): Promise<void> => {
    if (!input.password) {
      throw new Error("La contraseña es obligatoria al crear un usuario.");
    }

    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const existingUser = await getUserByEmail(input.email);
      if (existingUser) {
        toast.error("Ya existe un usuario con ese correo electrónico.");
        return;
      }
      const { password, ...rest } = input;

      await createUserFromAdmin({
        ...rest,
        password: password!,
      });
      await mutate();
      toast.success("Usuario creado correctamente");
    } catch (error) {
      toast.error("Error al crear el usuario");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = async (id: string, data: Partial<User>) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await updateUser(id, data);
      await mutate();
      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el usuario");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (isSubmitting) return;
    try {
      const currentUser = await requireRole(["admin"]);

      if (currentUser.id === id) {
        toast.error("No puedes eliminar tu propio usuario.");
        return;
      }

      setIsSubmitting(true);
      await deleteUserById(id);
      await mutate();
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el usuario");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    users: data,
    isLoading,
    isSubmitting,
    mutate,
    create,
    update,
    remove,
    userToView,
    setUserToView,
    open,
    setOpen,
  };
}
