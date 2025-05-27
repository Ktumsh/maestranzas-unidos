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
