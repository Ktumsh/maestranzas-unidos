import { Metadata } from "next";
import { redirect } from "next/navigation";

import SectionCards from "@/app/(dashboard)/_components/section-cards";

import { auth } from "../auth/auth";
import ChartEntriesByPart from "./_components/chart-entries-by-part";
import ChartInventoryMovements from "./_components/chart-inventory-movements";
import ChartPurchaseOrdersByStatus from "./_components/chart-purchase-orders-by-status";

export const metadata: Metadata = {
  title: "Panel de control",
  description: "Panel de control de inventario",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/auth/login");

  return (
    <>
      <SectionCards />
      <ChartInventoryMovements />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ChartEntriesByPart />
        <ChartPurchaseOrdersByStatus />
      </div>
    </>
  );
}
