import { requireRoleForPage } from "@/db/restriction";

import LowStockTable from "../_components/low-stock-table";

export default async function LowStockPage() {
  await requireRoleForPage(["admin", "bodega"]);

  return <LowStockTable />;
}
