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

import type { PartBatchWithPart } from "@/lib/types";

interface PartBatchDeleteViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: PartBatchWithPart | null;
  onDelete: () => void;
  isSubmitting: boolean;
}

const PartBatchDeleteViewer = ({
  open,
  onOpenChange,
  batch,
  onDelete,
  isSubmitting,
}: PartBatchDeleteViewerProps) => {
  const isMobile = useIsMobile();

  const batchName = batch?.batchCode ?? "lote";

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-warning">Eliminar lote</DrawerTitle>
          <DrawerDescription className="sr-only">
            Elimina el lote seleccionado de la base de datos.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 text-center text-sm">
          ¿Estás seguro de que quieres eliminar el lote{" "}
          <span className="text-warning font-semibold">{batchName}</span>? Esta
          acción no se puede deshacer.
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

export default PartBatchDeleteViewer;
