import type { Part, StockAlert } from "@/db/schema";

export type UserRole = "admin" | "bodega" | "compras";

export type StockAlertWithPartAndLocation = StockAlert & {
  part: Part;
  location?: {
    warehouse: string;
    shelf: string;
  };
};

export type PartWithLocation = Part & { resolvedLocation: string };
