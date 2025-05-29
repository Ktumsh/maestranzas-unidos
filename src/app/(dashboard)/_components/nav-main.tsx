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
import { useUser } from "@/hooks/use-user";

import { useParts } from "../_hooks/use-parts";
import { usePurchaseOrders } from "../_hooks/use-purchase-orders";
import { useSuppliers } from "../_hooks/use-suppliers";
import PurchaseOrderFormViewer from "../ordenes/_components/purchase-order-form-viewer";
import PartFormViewer from "../piezas/_components/part-form-viewer";

import type { MainItem } from "@/db/local/sidebar-data";

const NavMain = ({ items }: { items: Array<MainItem> }) => {
  const pathname = usePathname();

  const { user } = useUser();
  const { can } = usePermissions();

  const { parts, create, open, setOpen, isSubmitting } = useParts();

  const { suppliers } = useSuppliers();

  const {
    create: createOrder,
    open: openOrder,
    setOpen: setOpenOrder,
    isSubmitting: isSubmittingOrder,
  } = usePurchaseOrders();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          {/* Only admin */}
          {can("manage_parts") && (
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  onClick={() => setOpen({ ...open, create: true })}
                  className="bg-primary text-primary-content hover:bg-primary/90 hover:text-primary-content active:bg-primary/90 active:text-primary-content min-w-8 font-medium duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Nueva Pieza</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
          {can("manage_purchase_orders") && user?.role !== "admin" && (
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  disabled={suppliers.length === 0 || parts.length === 0}
                  onClick={() => setOpenOrder({ ...openOrder, create: true })}
                  className="bg-primary text-primary-content hover:bg-primary/90 hover:text-primary-content active:bg-primary/90 active:text-primary-content min-w-8 font-medium duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Nueva Orden</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
          {can("create_movements") && user?.role !== "admin" && (
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  asChild
                  className="bg-primary text-primary-content hover:bg-primary/90 hover:text-primary-content active:bg-primary/90 active:text-primary-content min-w-8 font-medium duration-200 ease-linear"
                >
                  <Link href="/inventario">
                    <IconCirclePlusFilled />
                    <span>Nuevo Movimiento</span>
                  </Link>
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
      <PurchaseOrderFormViewer
        open={openOrder.create}
        onOpenChange={(isOpen) =>
          setOpenOrder({ ...openOrder, create: isOpen })
        }
        isSubmitting={isSubmittingOrder}
        onSubmit={async (data) => {
          await createOrder(data);
          setOpenOrder({ ...openOrder, create: false });
        }}
        suppliers={suppliers}
        parts={parts}
      />
    </>
  );
};

export default NavMain;
