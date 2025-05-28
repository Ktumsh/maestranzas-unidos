import { toast } from "sonner";
import * as XLSX from "xlsx";

export function downloadFile(
  rows: (string | number)[][],
  filename: string,
  fileType: "csv" | "xlsx" = "xlsx",
) {
  if (fileType === "csv") {
    // Generar el archivo CSV
    const csvContent = rows
      .map((row) => row.map((value) => String(value)).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  } else if (fileType === "xlsx") {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario");

    XLSX.writeFile(wb, filename);
  }
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/files/upload-part", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const { error } = await response.json();
      toast.error(error);
      return;
    }

    const { url } = await response.json();

    const name = url.split("/").pop() ?? "";

    return {
      url,
      name,
      contentType: file.type,
      size: file.size,
    };
  } catch (err) {
    console.error(err);
    toast.error("Error al subir el archivo. Intenta nuevamente.");
  }
}

export async function deleteUploadedFile(
  url: string,
  onSuccess: () => void,
  onError: (msg: string) => void,
) {
  try {
    const res = await fetch("/api/files/delete-part", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      onSuccess();
    } else {
      const data = await res.json();
      onError(data.error ?? "Error desconocido al eliminar");
    }
  } catch {
    onError("Error de red al eliminar");
  }
}

export type WarehouseName =
  | "Bodega Norte"
  | "Bodega Central"
  | "Bodega Este"
  | "Bodega Sur";

export const warehouseColors: {
  background: Record<WarehouseName, string>;
  border: Record<WarehouseName, string>;
  text: Record<WarehouseName, string>;
  accentText: Record<WarehouseName, string>;
} = {
  background: {
    "Bodega Norte": "bg-info",
    "Bodega Central": "bg-warning",
    "Bodega Este": "bg-secondary",
    "Bodega Sur": "bg-success",
  },
  border: {
    "Bodega Norte": "border-info",
    "Bodega Central": "border-warning",
    "Bodega Este": "border-secondary",
    "Bodega Sur": "border-success",
  },
  text: {
    "Bodega Norte": "text-info-content",
    "Bodega Central": "text-warning-content",
    "Bodega Este": "text-secondary-content",
    "Bodega Sur": "text-success-content",
  },
  accentText: {
    "Bodega Norte": "text-info",
    "Bodega Central": "text-warning",
    "Bodega Este": "text-secondary",
    "Bodega Sur": "text-success",
  },
};

const shelfCoordinates: Record<
  string,
  Record<string, { x: number; y: number }>
> = {
  "Bodega Norte": {
    "1A": { x: 8, y: 29 },
    "1B": { x: 18, y: 29 },
    "2A": { x: 28, y: 29 },
  },
  "Bodega Sur": {
    "2B": { x: 8, y: 60 },
    "3A": { x: 18, y: 60 },
  },
  "Bodega Central": {
    "1A": { x: 42, y: 60 },
    "1B": { x: 52, y: 60 },
  },
  "Bodega Este": {
    "2A": { x: 68, y: 29 },
    "2B": { x: 78, y: 29 },
  },
};

export function getX(warehouse: string, shelfId: string): number {
  return shelfCoordinates[warehouse]?.[shelfId]?.x ?? 0;
}

export function getY(warehouse: string, shelfId: string): number {
  return shelfCoordinates[warehouse]?.[shelfId]?.y ?? 0;
}
