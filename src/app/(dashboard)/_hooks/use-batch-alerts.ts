"use client";

import { useCallback, useState } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

import type { ExpiringBatchAlert } from "@/lib/types";

export function useBatchAlerts() {
  const {
    data = [],
    isLoading,
    mutate,
    error,
  } = useSWR<Array<ExpiringBatchAlert>>("/api/batch-alerts", fetcher);

  const [loadingCheck, setLoadingCheck] = useState(false);

  const handleCheck = useCallback(async () => {
    setLoadingCheck(true);
    try {
      await fetch("/api/batch-alerts/check", { method: "POST" });
      await mutate();
    } catch (err) {
      console.error("Error al forzar verificación de lotes", err);
    } finally {
      setLoadingCheck(false);
    }
  }, [mutate]);

  return {
    alerts: data,
    isLoading,
    mutate,
    error,
    loadingCheck,
    handleCheck,
  };
}
