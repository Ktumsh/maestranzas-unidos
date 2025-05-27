import { requireRoleForPage } from "@/db/restriction";

export default async function ReportsPricingPage() {
  await requireRoleForPage(["admin", "compras"]);

  return <div>ReportsPricingPage</div>;
}
