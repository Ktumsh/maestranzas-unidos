"use client";

import { useMemo } from "react";

import { usePurchaseOrders } from "./use-purchase-orders";

export function usePurchaseOrdersChartData() {
  const { orders = [], isLoading } = usePurchaseOrders();

  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};

    for (const order of orders) {
      const status = order.status?.toLowerCase() || "sin estado";
      grouped[status] = (grouped[status] || 0) + 1;
    }

    return Object.entries(grouped).map(([status, total]) => ({
      status,
      label: status,
      value: total,
    }));
  }, [orders]);

  return {
    chartData,
    isLoading,
  };
}
