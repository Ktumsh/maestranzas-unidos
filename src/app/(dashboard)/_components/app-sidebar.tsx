"use client";

import Link from "next/link";
import { useMemo } from "react";

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
import { type CloudItem, sidebarData } from "@/db/local/sidebar-data";
import { usePermissions } from "@/hooks/use-permissions";
import { useUser } from "@/hooks/use-user";

import NavClouds from "./nav-clouds";

const AppSidebar = () => {
  const { user } = useUser();
  const { can } = usePermissions();

  const filteredNavMain = useMemo(() => {
    return sidebarData.navMain.filter((item) => {
      if (item.path === "/usuarios" && !can("manage_users")) return false;
      if (item.path === "/inventario" && !can("view_inventory")) return false;
      if (item.path === "/ordenes" && !can("view_purchase_orders"))
        return false;
      if (item.path === "/proveedores" && !can("manage_suppliers"))
        return false;

      if (item.path === "/piezas" && !can("view_parts")) return false;
      if (
        item.path === "/piezas" &&
        !can("create_movements") &&
        !can("manage_parts")
      )
        return false;

      return true;
    });
  }, [can]);

  const filteredReports = useMemo(() => {
    return sidebarData.reports.filter((item) => {
      if (
        item.path === "/reportes/inventario" &&
        !can("view_inventory_reports")
      )
        return false;
      if (item.path === "/reportes/precios" && !can("view_price_history"))
        return false;
      if (item.path === "/reportes/consumo" && !can("view_consumption_reports"))
        return false;
      return true;
    });
  }, [can]);

  const filteredNavClouds = useMemo(() => {
    return sidebarData.navClouds
      .map((section) => {
        const filteredItems = section.items.filter((item) => {
          if (item.path.startsWith("/movimientos") && !can("view_movements"))
            return false;
          if (item.path.startsWith("/alertas") && !can("view_alerts"))
            return false;
          return true;
        });

        if (filteredItems.length === 0) return null;

        return {
          ...section,
          items: filteredItems,
        };
      })
      .filter((s): s is CloudItem => s !== null);
  }, [can]);

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
        <NavMain items={filteredNavMain} />
        <NavReports items={filteredReports} />
        <NavClouds items={filteredNavClouds} />
        <NavSecondary items={sidebarData.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
