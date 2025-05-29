import { requireRoleForPage } from "@/db/restriction";

import ExpiringBatchesTable from "../_components/expiring-batches-table";

export default async function ExpirationPage() {
  await requireRoleForPage(["admin", "bodega"]);

  return <ExpiringBatchesTable />;
}
