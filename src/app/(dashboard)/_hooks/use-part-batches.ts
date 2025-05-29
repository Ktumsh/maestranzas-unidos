"use client";

import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import {
  createPartBatch,
  deletePartBatch,
  updatePartBatch,
} from "@/db/querys/part-batches-querys";
import { fetcher } from "@/lib/fetcher";

import type { PartBatchFormData } from "@/lib/form-schemas";
import type { PartBatchWithPart } from "@/lib/types";

export function usePartBatches() {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR<Array<PartBatchWithPart>>("/api/part-batches", fetcher);

  const [selectedBatch, setSelectedBatch] = useState<PartBatchWithPart | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    delete: false,
    view: false,
  });

  const create = async (data: PartBatchFormData) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await createPartBatch(data);
      await mutate();
      toast.success("Lote creado correctamente");
    } catch (err) {
      toast.error("Error al crear el lote");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = async (id: string, data: PartBatchFormData) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await updatePartBatch(id, data);
      await mutate();
      toast.success("Lote actualizado correctamente");
    } catch (err) {
      toast.error("Error al actualizar lote");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await deletePartBatch(id);
      await mutate();
      toast.success("Lote eliminado");
    } catch (err) {
      toast.error("Error al eliminar lote");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    batches: data,
    isLoading,
    isSubmitting,
    create,
    update,
    remove,
    mutate,
    selectedBatch,
    setSelectedBatch,
    open,
    setOpen,
  };
}
