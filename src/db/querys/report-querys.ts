"use server";

import { db } from "../db";
import { requireRole } from "../restriction";
import { inventoryReports, type InventoryReport, activityLog } from "../schema";

interface ReportData {
  name: string;
  filePath: string;
  reportType: string;
}

export async function createInventoryReport(
  reportData: ReportData,
): Promise<InventoryReport> {
  try {
    const user = await requireRole(["admin", "bodega", "compras"]);

    const [newReport] = await db
      .insert(inventoryReports)
      .values(reportData)
      .returning();

    await db.insert(activityLog).values({
      userId: user.id,
      action: `Creó un reporte de inventario: ${reportData.name} (${reportData.reportType})`,
      entityType: "inventory_report",
      entityId: newReport.id,
    });

    return newReport;
  } catch (error) {
    console.error("Error al guardar el reporte:", error);
    throw error;
  }
}

export async function getAllReports(): Promise<Array<InventoryReport>> {
  try {
    const reports = await db.select().from(inventoryReports);
    return reports;
  } catch (error) {
    console.error("Error al obtener los reportes:", error);
    throw error;
  }
}
