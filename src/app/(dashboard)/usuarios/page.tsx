import { requireRoleForPage } from "@/db/restriction";

import UserTable from "./_components/user-table";

export default async function UsersPage() {
  await requireRoleForPage(["admin"]);

  return <UserTable />;
}
