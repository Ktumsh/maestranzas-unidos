import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import {
  createSupplier,
  deleteSupplierById,
  updateSupplier,
} from "@/db/querys/suppliers-querys";
import { fetcher } from "@/lib/fetcher";

import type { Supplier } from "@/db/schema";

export function useSuppliers() {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR<Array<Supplier>>("/api/suppliers", fetcher);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    delete: false,
  });

  const create = async (data: {
    name: string;
    contactEmail: string;
    contactPhone: string;
  }): Promise<void> => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await createSupplier(data);
      await mutate();
      toast.success("Proveedor registrado correctamente");
    } catch (error) {
      toast.error("Error al registrar el proveedor");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = async (id: string, data: Partial<Supplier>) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await updateSupplier(id, data);
      await mutate();
      toast.success("Proveedor actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el proveedor");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await deleteSupplierById(id);
      await mutate();
      toast.success("Proveedor eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el proveedor");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    suppliers: data,
    isLoading,
    isSubmitting,
    mutate,
    create,
    update,
    remove,
    open,
    setOpen,
    selectedSupplier,
    setSelectedSupplier,
  };
}
