import { requireRoleForPage } from "@/db/restriction";

import ReportsTable from "../_components/reports-table";

export default async function ReportsInventoryPage() {
  await requireRoleForPage(["admin", "bodega"]);
  return <ReportsTable />;
}
