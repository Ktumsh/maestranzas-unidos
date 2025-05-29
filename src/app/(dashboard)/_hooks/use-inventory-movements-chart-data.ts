"use client";

import { format, subDays, isAfter } from "date-fns";

import { usePartMovements } from "./use-part-movements";

type Range = "7d" | "30d" | "90d";

type ChartDataPoint = {
  date: string;
  entradas: number;
  salidas: number;
};

export function useInventoryMovementsChartData(range: Range = "90d") {
  const { movements = [], isLoading } = usePartMovements();

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const startDate = subDays(new Date(), days);

  const grouped: Record<string, ChartDataPoint> = {};

  for (const movement of movements) {
    const date = movement.createdAt ? new Date(movement.createdAt) : null;
    if (!date || !isAfter(date, startDate)) continue;

    if (movement.type !== "entrada" && movement.type !== "salida") continue;

    const dayKey = format(date, "yyyy-MM-dd");

    if (!grouped[dayKey]) {
      grouped[dayKey] = {
        date: dayKey,
        entradas: 0,
        salidas: 0,
      };
    }

    if (movement.type === "entrada") {
      grouped[dayKey].entradas += movement.quantity;
    } else {
      grouped[dayKey].salidas += movement.quantity;
    }
  }

  const completeChartData: ChartDataPoint[] = [];

  for (let i = 0; i < days; i++) {
    const currentDate = subDays(new Date(), days - 1 - i);
    const dayKey = format(currentDate, "yyyy-MM-dd");

    completeChartData.push(
      grouped[dayKey] ?? {
        date: dayKey,
        entradas: 0,
        salidas: 0,
      },
    );
  }

  return {
    chartData: completeChartData,
    isLoading,
  };
}
