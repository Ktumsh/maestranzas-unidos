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

import type { Supplier } from "@/db/schema";

interface SupplierDeleteViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onDelete: () => void;
  isSubmitting: boolean;
}

const SupplierDeleteViewer = ({
  open,
  onOpenChange,
  supplier,
  onDelete,
  isSubmitting,
}: SupplierDeleteViewerProps) => {
  const isMobile = useIsMobile();

  const supplierName = supplier ? supplier.name : "proveedor";

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-warning">Eliminar proveedor</DrawerTitle>
          <DrawerDescription className="sr-only">
            Elimina al proveedor seleccionado de la base de datos.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 text-center text-sm">
          ¿Estás seguro de que quieres eliminar al proveedor{" "}
          <span className="text-warning font-semibold">{supplierName}</span>?
          Esta acción no se puede deshacer.
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

export default SupplierDeleteViewer;
