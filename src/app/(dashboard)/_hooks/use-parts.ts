"use client";

import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { registerPartMovement } from "@/db/querys/part-movements-querys";
import {
  createPart,
  deletePartById,
  updatePart,
} from "@/db/querys/parts-querys";
import { createInventoryReport } from "@/db/querys/report-querys";
import { fetcher } from "@/lib/fetcher";
import { formatDate } from "@/lib/format";

import { downloadFile } from "../_lib/utils";

import type { Part } from "@/db/schema";
import type {
  EditPartFormData,
  PartFormData,
  PartMovementFormData,
} from "@/lib/form-schemas";
import type { PartWithLocation } from "@/lib/types";

export function useParts() {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR<Array<PartWithLocation>>("/api/parts", fetcher);

  const [selectedPart, setSelectedPart] = useState<PartWithLocation | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    delete: false,
    movement: false,
    detail: false,
  });

  const create = async (
    data: PartFormData | EditPartFormData,
  ): Promise<void> => {
    if ("serialNumber" in data === false) {
      throw new Error("El número de serie es obligatorio al crear una pieza.");
    }

    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await createPart(data);
      await mutate();
      toast.success("Pieza registrada correctamente");
    } catch (error) {
      toast.error("Error al registrar la pieza");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = async (
    id: string,
    data: Partial<Omit<Part, "id" | "createdAt">>,
  ) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await updatePart(id, data);
      await mutate();
      toast.success("Pieza actualizada correctamente");
    } catch (error) {
      toast.error("Error al actualizar la pieza");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await deletePartById(id);
      await mutate();
      toast.success("Pieza eliminada correctamente");
    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : "Error al eliminar la pieza";

      if (
        message.includes(
          "No se puede eliminar esta pieza porque está asociada a una orden de compra",
        )
      ) {
        toast.error(
          "No se puede eliminar esta pieza porque está asociada a una orden de compra.",
        );
      } else {
        toast.error("Error al eliminar la pieza");
      }

      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerMovement = async (
    partId: string,
    data: PartMovementFormData,
  ) => {
    if (isSubmitting || !data.reason || data.quantity < 1) return;

    try {
      setIsSubmitting(true);

      if (data.type === "salida") {
        if (!selectedPart) {
          toast.error("No se pudo encontrar la pieza seleccionada.");
          return;
        }

        if (selectedPart.stock < data.quantity) {
          toast.error(
            `Stock insuficiente: solo hay ${selectedPart.stock} unidades en inventario.`,
          );
          return;
        }
      }

      await registerPartMovement({
        partId,
        type: data.type,
        reason: data.reason,
        quantity: data.quantity,
      });

      await mutate();
      toast.success("Movimiento registrado correctamente");
    } catch (error) {
      toast.error("Error al registrar el movimiento");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateReport = async () => {
    const csvRows = [
      [
        "N° de Serie",
        "Descripción",
        "Ubicación",
        "Stock Actual",
        "Stock Mínimo",
        "Fecha de Creación",
      ],
      ...data.map((part) => [
        part.serialNumber,
        part.description,
        part.locationId,
        part.stock,
        part.minStock,
        formatDate(part.createdAt as Date, "dd MMM yyyy"),
      ]),
    ];

    const fileName = `reporte_inventario_${formatDate(new Date(), "yyyyMMdd_HHmmss")}.xlsx`;

    downloadFile(csvRows, fileName);

    const filePath = `/reports/${fileName}`;

    const newReport = {
      name: "Reporte de Inventario " + formatDate(new Date(), "dd MMM yyyy"),
      filePath,
      reportType: "inventario completo",
    };

    try {
      await createInventoryReport(newReport);
      toast.success("Reporte generado y guardado correctamente");
    } catch (error) {
      toast.error("Error al guardar el reporte");
      console.error(error);
    }
  };

  return {
    parts: data,
    isLoading,
    isSubmitting,
    mutate,
    create,
    update,
    remove,
    registerMovement,
    generateReport,
    selectedPart,
    setSelectedPart,
    open,
    setOpen,
  };
}
