"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

import type { PartMovement } from "@/db/schema";

export function usePartMovements() {
  const {
    data = [],
    isLoading,
    error,
    mutate,
  } = useSWR<Array<PartMovement>>("/api/part-movements", fetcher);

  return {
    movements: data,
    isLoading,
    error,
    mutate,
  };
}
