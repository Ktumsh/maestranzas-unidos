"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { ReportItem } from "@/db/local/sidebar-data";

const NavReports = ({ items }: { items: Array<ReportItem> }) => {
  const pathname = usePathname();

  if (items.length === 0) return null;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Reportes</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.path;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={item.path}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavReports;
