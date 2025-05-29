import { requireRoleForPage } from "@/db/restriction";

import PurchaseOrderTable from "./_components/purchase-order-table";

export default async function OrdersPage() {
  await requireRoleForPage(["admin", "compras"]);

  return <PurchaseOrderTable />;
}
