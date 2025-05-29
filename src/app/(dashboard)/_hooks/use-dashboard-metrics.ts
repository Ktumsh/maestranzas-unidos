"use client";

import { differenceInDays, isAfter } from "date-fns";

import { usePartBatches } from "./use-part-batches";
import { useParts } from "./use-parts";
import { usePurchaseOrders } from "./use-purchase-orders";
import { useStockAlerts } from "./use-stock-alerts";

export function useDashboardMetrics() {
  const { parts, isLoading: loadingParts } = useParts();
  const { alerts, isLoading: loadingAlerts } = useStockAlerts();
  const { batches, isLoading: loadingBatches } = usePartBatches();
  const { orders, isLoading: loadingOrders } = usePurchaseOrders();

  const today = new Date();

  const totalParts = parts.length;
  const lowStockCount = alerts.length;

  const expiringBatchesCount = batches.filter((b) => {
    if (!b.expirationDate) return false;
    const expDate = new Date(b.expirationDate);
    return isAfter(expDate, today) && differenceInDays(expDate, today) <= 15;
  }).length;

  const pendingPurchaseOrders = orders.filter(
    (o) => o.status === "pendiente",
  ).length;

  const isLoading =
    loadingParts || loadingAlerts || loadingBatches || loadingOrders;

  return {
    metrics: {
      totalParts,
      lowStockCount,
      expiringBatchesCount,
      pendingPurchaseOrders,
    },
    isLoading,
  };
}
