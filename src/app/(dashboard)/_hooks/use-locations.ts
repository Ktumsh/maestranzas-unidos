"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

import type { Location } from "@/db/schema";

export function useLocations() {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR<Location[]>("/api/locations", fetcher);

  return {
    locations: data,
    isLoading,
    mutate,
  };
}
