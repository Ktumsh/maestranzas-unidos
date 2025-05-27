import { requireRoleForPage } from "@/db/restriction";

import PartTable from "./_components/part-table";

export default async function PartsPage() {
  await requireRoleForPage(["admin", "bodega"]);

  return <PartTable />;
}
