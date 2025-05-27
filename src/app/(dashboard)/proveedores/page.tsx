import { requireRoleForPage } from "@/db/restriction";

export default async function SuppliersPage() {
  await requireRoleForPage(["admin", "compras"]);

  return <div>SuppliersPage</div>;
}
