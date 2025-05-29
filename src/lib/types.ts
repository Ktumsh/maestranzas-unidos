import type {
  Part,
  PartBatch,
  PurchaseOrder,
  PurchaseOrderItem,
  StockAlert,
} from "@/db/schema";

export type UserRole = "admin" | "bodega" | "compras";

export type StockAlertWithPartAndLocation = StockAlert & {
  part: Part;
  location?: {
    warehouse: string;
    shelf: string;
  };
};

export type PartWithLocation = Part & { resolvedLocation: string };

export type PurchaseOrderWithItems = PurchaseOrder & {
  supplier?: {
    name: string;
  };
  items?: Array<
    PurchaseOrderItem & {
      part: {
        image: string | null;
        serialNumber: string;
      };
    }
  >;
};

export type PartBatchWithPart = PartBatch & {
  part: {
    id: string;
    serialNumber: string;
    image: string | null;
  } | null;
};

export type ExpiringBatchAlert = {
  id: string;
  expirationDate: Date;
  createdAt: Date;
  batchCode: string;
  quantity: number;
  serialNumber: string;
  image: string | null;
};
