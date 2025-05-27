import { requireRoleForPage } from "@/db/restriction";

import SupplierTable from "./_components/supplier-table";

export default async function SuppliersPage() {
  await requireRoleForPage(["admin", "compras"]);

  return <SupplierTable />;
}
