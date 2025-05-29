import { requireRoleForPage } from "@/db/restriction";

import PartBatchTable from "./_components/part-batch-table";

export default async function BatchesPage() {
  await requireRoleForPage(["admin", "bodega"]);

  return <PartBatchTable />;
}
