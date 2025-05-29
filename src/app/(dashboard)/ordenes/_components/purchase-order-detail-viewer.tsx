"use client";

import { IconNut } from "@tabler/icons-react";
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

import type { PurchaseOrderWithItems } from "@/lib/types";

interface PurchaseOrderDetailViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: PurchaseOrderWithItems | null;
}

const PurchaseOrderDetailViewer = ({
  open,
  onOpenChange,
  order,
}: PurchaseOrderDetailViewerProps) => {
  const isMobile = useIsMobile();

  if (!order) return null;

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Detalle de la orden</DrawerTitle>
          <DrawerDescription>
            Visualiza la información de la orden de compra{" "}
            <span className="text-info font-semibold uppercase">
              #{order?.id.slice(0, 8)}
            </span>{" "}
            del{" "}
            <span className="text-info font-semibold">
              {order.createdAt
                ? formatDate(order.createdAt, "dd MMM yyyy")
                : "—"}
            </span>
            .
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 px-4 py-2 text-sm">
          <div>
            <p className="text-base-content/60 text-xs">Proveedor</p>
            <p className="font-medium">
              {order.supplier?.name ?? "Desconocido"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base-content/60 text-xs">Estado</p>
              <p className="font-medium capitalize">
                {order.status ?? "pendiente"}
              </p>
            </div>
            <div>
              <p className="text-base-content/60 text-xs">Fecha de creación</p>
              <p className="font-medium">
                {order.createdAt
                  ? formatDate(order.createdAt, "dd MMM yyyy")
                  : "—"}
              </p>
            </div>
          </div>

          {order.notes && (
            <div>
              <p className="text-base-content/60 text-xs">Notas</p>
              <p className="font-medium">{order.notes}</p>
            </div>
          )}

          <div>
            <p className="text-base-content/60 text-xs">Piezas solicitadas</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              {order.items?.length ? (
                order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    {item.part.image ? (
                      <Image
                        src={item.part.image}
                        alt="Imagen de la pieza"
                        width={32}
                        height={32}
                        className="rounded-box h-8 w-auto object-cover"
                      />
                    ) : (
                      <div className="bg-base-100 rounded-box flex size-6 items-center justify-center">
                        <span className="text-base-content/60 text-xs">
                          <IconNut className="size-4" />
                        </span>
                      </div>
                    )}
                    <div className="grid">
                      <span className="font-medium">
                        {item.part.serialNumber}
                      </span>
                      <span className="text-base-content/60 leading-none">
                        {item.quantity} unidad(es)
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-base-content/60 italic">
                  Sin piezas registradas
                </li>
              )}
            </ul>
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

export default PurchaseOrderDetailViewer;
