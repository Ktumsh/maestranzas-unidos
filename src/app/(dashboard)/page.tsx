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
    <>
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data} />
    </>
  );
}
