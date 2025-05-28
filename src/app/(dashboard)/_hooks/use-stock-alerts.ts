"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

import type { StockAlertWithPartAndLocation } from "@/lib/types";

export function useStockAlerts() {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR<Array<StockAlertWithPartAndLocation>>(
    "/api/stock-alerts",
    fetcher,
  );

  return {
    alerts: data,
    isLoading,
    mutate,
  };
}
