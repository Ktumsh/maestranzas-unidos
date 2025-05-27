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

import type { Part } from "@/db/schema";

interface PartDeleteViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part: Part | null;
  onDelete: () => void;
  isSubmitting: boolean;
}

const PartDeleteViewer = ({
  open,
  onOpenChange,
  part,
  onDelete,
  isSubmitting,
}: PartDeleteViewerProps) => {
  const isMobile = useIsMobile();

  const label = part?.serialNumber
    ? `pieza con N° de serie ${part.serialNumber}`
    : "pieza seleccionada";

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-warning">Eliminar pieza</DrawerTitle>
          <DrawerDescription className="sr-only">
            Elimina la pieza seleccionada del sistema.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 text-center text-sm">
          ¿Estás seguro de que quieres eliminar la{" "}
          <span className="text-warning font-semibold">{label}</span>? Esta
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

export default PartDeleteViewer;
