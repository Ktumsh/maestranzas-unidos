import { requireRoleForPage } from "@/db/restriction";

export default async function ExpirationPage() {
  await requireRoleForPage(["admin", "bodega"]);

  return <div>ExpirationPage</div>;
}
