"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

import type { InventoryReport } from "@/db/schema";

export function useReports() {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR<InventoryReport[]>("/api/reports", fetcher);

  return {
    reports: data,
    isLoading,
    mutate,
  };
}
