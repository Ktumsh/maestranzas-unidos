import { requireRoleForPage } from "@/db/restriction";

import PartMovementTable from "./_components/part-movement-table";

export default async function MovementsPage() {
  await requireRoleForPage(["admin", "bodega"]);

  return <PartMovementTable />;
}
