import { requireRoleForPage } from "@/db/restriction";

export default async function OrdersPage() {
  await requireRoleForPage(["admin", "compras"]);

  return <div>OrdersPage</div>;
}
