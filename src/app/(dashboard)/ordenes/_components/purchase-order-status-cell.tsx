"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { usePurchaseOrders } from "../../_hooks/use-purchase-orders";
import { ORDER_STATUS_COLORS, ORDER_STATUS_ICONS } from "../../_lib/utils";

type PurchaseOrderStatusCellProps = {
  id: string;
  initialStatus: string;
};

const PurchaseOrderStatusCell = ({
  id,
  initialStatus,
}: PurchaseOrderStatusCellProps) => {
  const [estado, setEstado] = useState(initialStatus);
  const { updateStatus } = usePurchaseOrders();

  const StatusIcon = ORDER_STATUS_ICONS[estado];
  const statusColor = ORDER_STATUS_COLORS[estado] ?? "";

  return (
    <>
      <Label htmlFor={`${id}-status`} className="sr-only">
        Estado
      </Label>
      <Select
        disabled={initialStatus === "recibida"}
        value={estado}
        onValueChange={async (newStatus) => {
          if (newStatus === estado) return;
          setEstado(newStatus);
          try {
            await updateStatus(id, newStatus);
          } catch {
            setEstado(initialStatus);
          }
        }}
      >
        <SelectTrigger
          id={`${id}-status`}
          size="sm"
          className={cn(
            "h-auto w-38 py-1.5 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate",
            statusColor,
          )}
        >
          <div className="flex items-center gap-2">
            {StatusIcon && (
              <StatusIcon
                className={cn(
                  "size-3.5",
                  estado === "recibida" && "fill-success",
                )}
              />
            )}
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="pendiente">Pendiente</SelectItem>
          <SelectItem value="enviada">Enviada</SelectItem>
          <SelectItem value="recibida">Recibida</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default PurchaseOrderStatusCell;
