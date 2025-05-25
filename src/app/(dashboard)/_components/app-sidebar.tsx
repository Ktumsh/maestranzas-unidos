"use client";

import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";

import NavMain from "@/app/(dashboard)/_components/nav-main";
import NavReports from "@/app/(dashboard)/_components/nav-reports";
import NavSecondary from "@/app/(dashboard)/_components/nav-secondary";
import NavUser from "@/app/(dashboard)/_components/nav-user";
import Logo from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";

const data = {
  user: {
    name: "Administrador",
    email: "admin@maestranza.cl",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Panel Principal",
      path: "/",
      icon: IconDashboard,
    },
    {
      title: "Inventario",
      path: "/inventario",
      icon: IconDatabase,
    },
    {
      title: "Piezas y Componentes",
      path: "/piezas",
      icon: IconListDetails,
    },
    {
      title: "Proveedores",
      path: "/proveedores",
      icon: IconUsers,
    },
    {
      title: "Órdenes de Compra",
      path: "/ordenes",
      icon: IconFileDescription,
    },
  ],
  navClouds: [
    {
      title: "Movimientos",
      icon: IconChartBar,
      path: "#",
      items: [
        { title: "Entradas y Salidas", path: "/movimientos" },
        {
          title: "Transferencias Internas",
          path: "/movimientos/transferencias",
        },
        { title: "Uso en Proyectos", path: "/movimientos/proyectos" },
      ],
    },
    {
      title: "Alertas",
      icon: IconReport,
      path: "#",
      items: [
        { title: "Stock Bajo", path: "/alertas/stock-bajo" },
        { title: "Lotes por Vencer", path: "/alertas/vencimiento" },
      ],
    },
  ],
  documents: [
    {
      name: "Reportes de Inventario",
      path: "/reportes/inventario",
      icon: IconFileWord,
    },
    {
      name: "Historial de Precios",
      path: "/reportes/precios",
      icon: IconFileAi,
    },
    {
      name: "Consumos y Tendencias",
      path: "/reportes/consumo",
      icon: IconFileDescription,
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      path: "/configuracion",
      icon: IconSettings,
    },
    {
      title: "Centro de Ayuda",
      path: "/ayuda",
      icon: IconHelp,
    },
  ],
};

const AppSidebar = () => {
  const { user } = useUser();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="h-16">
        <SidebarMenuButton
          asChild
          className="h-full data-[slot=sidebar-menu-button]:!p-1.5"
        >
          <Link href="/">
            <div className="size-8 overflow-hidden rounded-lg border">
              <Logo />
            </div>
            <span className="text-base font-semibold">
              Maestranzas Unidos S.A.
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavReports items={data.documents} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
