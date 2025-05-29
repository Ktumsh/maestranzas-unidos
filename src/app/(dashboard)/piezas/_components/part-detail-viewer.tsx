"use client";

import Image from "next/image";

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

import type { PartWithLocation } from "@/lib/types";

interface PartDetailViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part: PartWithLocation | null;
}

const PartDetailViewer = ({
  part,
  open,
  onOpenChange,
}: PartDetailViewerProps) => {
  const isMobile = useIsMobile();

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Detalle de la pieza</DrawerTitle>
          <DrawerDescription>
            Visualiza la información de la pieza{" "}
            <span className="text-secondary font-semibold">
              {part?.serialNumber}
            </span>
            .
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 px-4 py-2 text-sm">
          {part?.image && (
            <div className="rounded-box bg-neutral flex justify-center overflow-hidden">
              <Image
                src={part.image}
                alt="Imagen de la pieza"
                width={351}
                height={351}
                className="h-72 w-auto object-cover"
              />
            </div>
          )}

          <div>
            <p className="text-base-content/60 text-xs">N° de serie</p>
            <p className="font-medium">{part?.serialNumber}</p>
          </div>

          <div>
            <p className="text-base-content/60 text-xs">Descripción</p>
            <p className="font-medium">{part?.description}</p>
          </div>

          <div>
            <p className="text-base-content/60 text-xs">Ubicación</p>
            <p className="font-medium">{part?.resolvedLocation}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base-content/60 text-xs">Stock mínimo</p>
              <p className="font-medium">{part?.minStock}</p>
            </div>
            <div>
              <p className="text-base-content/60 text-xs">Stock actual</p>
              <p className="font-medium">{part?.stock}</p>
            </div>
          </div>

          <div>
            <p className="text-base-content/60 text-xs">Fecha de creación</p>
            <p className="font-medium">
              {part?.createdAt &&
                formatDate(part?.createdAt as Date, "dd MMM yyyy")}
            </p>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button outline>Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PartDetailViewer;
