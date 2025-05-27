import { requireRoleForPage } from "@/db/restriction";

export default async function TransfersPage() {
  await requireRoleForPage(["admin", "bodega"]);

  return <div>TransfersPage</div>;
}
