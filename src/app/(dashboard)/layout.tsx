import { cookies } from "next/headers";

import SiteLayout from "@/app/(dashboard)/_components/site-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  return <SiteLayout sidebarState={!isCollapsed}>{children}</SiteLayout>;
}
