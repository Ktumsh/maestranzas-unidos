"use client";

import { IconLoader } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatDate } from "@/lib/format";

import type { PurchaseOrderWithItems } from "@/lib/types";

interface PurchaseOrderDeleteViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: PurchaseOrderWithItems | null;
  onDelete: () => void;
  isSubmitting: boolean;
}

const PurchaseOrderDeleteViewer = ({
  open,
  onOpenChange,
  order,
  onDelete,
  isSubmitting,
}: PurchaseOrderDeleteViewerProps) => {
  const isMobile = useIsMobile();

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-warning">Eliminar orden</DrawerTitle>
          <DrawerDescription className="sr-only">
            Elimina la orden de compra seleccionada de la base de datos.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 text-center text-sm">
          ¿Estás seguro de que quieres eliminar la orden{" "}
          <span className="text-warning font-semibold uppercase">
            #{order?.id.slice(0, 8)}
          </span>{" "}
          del{" "}
          <span className="text-warning font-semibold">
            {order?.createdAt
              ? formatDate(order.createdAt, "dd MMM yyyy")
              : "—"}
          </span>
          ? Esta acción no se puede deshacer.
        </div>

        <DrawerFooter>
          <Button disabled={isSubmitting} variant="error" onClick={onDelete}>
            {isSubmitting ? (
              <IconLoader className="animate-spin" />
            ) : (
              "Confirmar eliminación"
            )}
          </Button>
          <DrawerClose asChild>
            <Button disabled={isSubmitting} outline>
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PurchaseOrderDeleteViewer;
