"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { usePermissions } from "@/hooks/use-permissions";
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

  const { can } = usePermissions();

  if (!can("manage_purchase_orders")) {
    return (
      <Badge
        variant="outline"
        soft={false}
        className={cn("text-base-content/60 px-1.5", statusColor)}
      >
        {StatusIcon && (
          <StatusIcon
            className={cn("size-3.5", estado === "recibida" && "fill-success")}
          />
        )}
        {estado}
      </Badge>
    );
  }

  return (
    <>
      <Label htmlFor={`${id}-status`} className="sr-only">
        Estado
      </Label>
      <Select
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
            "h-auto w-38 cursor-pointer py-1.5 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate",
            statusColor,
            initialStatus === "recibida" && "pointer-events-none",
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
