"use client";

import { useMemo } from "react";

import { usePartMovements } from "./use-part-movements";
import { useParts } from "./use-parts";

type ChartEntryByPart = {
  partId: string;
  label: string;
  total: number;
};

export function useEntryByPartChartData() {
  const { movements = [], isLoading: loadingMovements } = usePartMovements();
  const { parts = [], isLoading: loadingParts } = useParts();

  const chartData = useMemo<ChartEntryByPart[]>(() => {
    const grouped: Record<string, number> = {};

    for (const movement of movements) {
      if (movement.type !== "entrada" || !movement.partId) continue;

      grouped[movement.partId] =
        (grouped[movement.partId] || 0) + movement.quantity;
    }

    return Object.entries(grouped).map(([partId, total]) => {
      const part = parts.find((p) => p.id === partId);
      const label = part?.serialNumber ?? `Pieza ${partId.slice(0, 6)}...`;

      return { partId, label, total };
    });
  }, [movements, parts]);

  return {
    chartData,
    isLoading: loadingMovements || loadingParts,
  };
}
