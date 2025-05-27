import { requireRoleForPage } from "@/db/restriction";

export default async function ProjectsPage() {
  await requireRoleForPage(["admin", "bodega"]);

  return <div>ProjectsPage</div>;
}
