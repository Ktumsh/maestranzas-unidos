"use client";

import { IconCirclePlusFilled } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePermissions } from "@/hooks/use-permissions";

import { useParts } from "../_hooks/use-parts";
import PartFormViewer from "../piezas/_components/part-form-viewer";

import type { MainItem } from "@/db/local/sidebar-data";

const NavMain = ({ items }: { items: Array<MainItem> }) => {
  const pathname = usePathname();

  const { can } = usePermissions();

  const { create, open, setOpen, isSubmitting } = useParts();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          {/* Only admin */}
          {can("manage_parts") && (
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="Registrar Nueva Pieza"
                  onClick={() => setOpen({ ...open, create: true })}
                  className="bg-primary text-primary-content hover:bg-primary/90 hover:text-primary-content active:bg-primary/90 active:text-primary-content min-w-8 font-medium duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Nuevo Registro</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
          <SidebarMenu>
            {items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    asChild
                  >
                    <Link href={item.path}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <PartFormViewer
        mode="create"
        isSubmitting={isSubmitting}
        open={open.create}
        onOpenChange={(isOpen) => setOpen({ ...open, create: isOpen })}
        onSubmit={create}
      />
    </>
  );
};

export default NavMain;
