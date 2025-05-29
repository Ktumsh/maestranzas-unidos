"use client";

import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import {
  createPurchaseOrder,
  deletePurchaseOrder,
  updatePurchaseOrderStatus,
} from "@/db/querys/purchase-orders-querys";
import { fetcher } from "@/lib/fetcher";

import type { PurchaseOrderFormData } from "@/lib/form-schemas";
import type { PurchaseOrderWithItems } from "@/lib/types";

export function usePurchaseOrders() {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR<PurchaseOrderWithItems[]>("/api/purchase-orders", fetcher);

  const [selectedOrder, setSelectedOrder] =
    useState<PurchaseOrderWithItems | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState({
    create: false,
    delete: false,
    view: false,
  });

  const create = async (data: PurchaseOrderFormData): Promise<void> => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createPurchaseOrder(data);
      await mutate();
      toast.success("Orden de compra registrada correctamente");
    } catch (error) {
      toast.error("Error al registrar la orden de compra");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string): Promise<void> => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await updatePurchaseOrderStatus(id, status);
      await mutate();
      toast.success("Estado actualizado");
    } catch (error: any) {
      const message = error?.message ?? "Error al actualizar el estado";

      if (message.includes("ya ha sido recibida")) {
        toast.warning("La orden ya fue recibida anteriormente");
      } else if (message.includes("no encontrada")) {
        toast.error("Orden no encontrada");
      } else {
        toast.error(message);
      }

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await deletePurchaseOrder(id);
      await mutate();
      toast.success("Orden eliminada correctamente");
    } catch (error: any) {
      toast.error("Error al eliminar la orden");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    orders: data,
    isLoading,
    isSubmitting,
    mutate,
    create,
    updateStatus,
    remove,
    selectedOrder,
    setSelectedOrder,
    open,
    setOpen,
  };
}
