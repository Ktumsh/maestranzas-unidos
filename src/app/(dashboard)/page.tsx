import { Metadata } from "next";
import { redirect } from "next/navigation";

import { DataTable } from "@/app/(dashboard)/_components/data-table";
import { SectionCards } from "@/app/(dashboard)/_components/section-cards";

import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import data from "./data.json";
import { auth } from "../auth/auth";

export const metadata: Metadata = {
  title: "Panel de control",
  description: "Panel de control de inventario",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/auth/login");

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
