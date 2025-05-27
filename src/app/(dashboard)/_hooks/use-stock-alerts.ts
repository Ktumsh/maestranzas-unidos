"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

import type { Part, StockAlert } from "@/db/schema";

export function useStockAlerts() {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR<Array<StockAlert & { part: Part }>>("/api/stock-alerts", fetcher);

  return {
    alerts: data,
    isLoading,
    mutate,
  };
}
