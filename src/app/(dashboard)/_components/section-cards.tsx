"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/use-permissions";

import { useDashboardMetrics } from "../_hooks/use-dashboard-metrics";

import type { PermissionKey } from "@/db/permissions";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("es-CL").format(value);

const SectionCards = () => {
  const { metrics, isLoading } = useDashboardMetrics();

  const getIcon = (value: number | undefined, direction: "up" | "down") => {
    if (value === undefined) return null;
    return direction === "up" ? (
      <IconTrendingUp className="size-4" />
    ) : (
      <IconTrendingDown className="size-4" />
    );
  };

  const { can } = usePermissions();

  const cards = [
    {
      title: "Total de Piezas",
      value: metrics?.totalParts,
      icon: getIcon(metrics?.totalParts, "up"),
      badge: "+0%",
      badgeColor: "default",
      footer: "Piezas activas en inventario",
      subtext: "Incluye piezas disponibles",
      permissionRequired: "view_inventory" as PermissionKey,
    },
    {
      title: "Stock Bajo",
      value: metrics?.lowStockCount,
      icon: getIcon(
        metrics?.lowStockCount,
        metrics?.lowStockCount > 0 ? "down" : "up",
      ),
      badge: metrics?.lowStockCount > 0 ? "Urgente" : "OK",
      badgeColor: metrics?.lowStockCount > 0 ? "error" : "outline",
      footer: "Productos bajo el mínimo",
      subtext: "Requieren reposición inmediata",
      permissionRequired: "view_alerts" as PermissionKey,
    },
    {
      title: "Lotes por Vencer",
      value: metrics?.expiringBatchesCount,
      icon: getIcon(metrics?.expiringBatchesCount, "down"),
      badge: "Próx. 15 días",
      badgeColor: "warning",
      footer: "Incluye químicos/lubricantes",
      subtext: "Según fecha de vencimiento",
      permissionRequired: "view_expiring_lots" as PermissionKey,
    },
    {
      title: "Órdenes Pendientes",
      value: metrics?.pendingPurchaseOrders,
      icon: getIcon(metrics?.pendingPurchaseOrders, "up"),
      badge: "En proceso",
      badgeColor: "outline",
      footer: "Aprobación pendiente",
      subtext: "Emitidas pero no procesadas",
      permissionRequired: "view_purchase_orders" as PermissionKey,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {(isLoading
        ? Array(4).fill(null)
        : cards.filter((card) => can(card.permissionRequired))
      ).map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>
              {card?.title ?? <Skeleton className="h-4 w-32" />}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card?.value !== undefined ? (
                formatNumber(card.value)
              ) : (
                <Skeleton className="h-8 w-20" />
              )}
            </CardTitle>
            <CardAction>
              {card ? (
                <Badge variant={card.badgeColor}>
                  {card.icon}
                  {card.badge}
                </Badge>
              ) : (
                <Skeleton className="h-6 w-24 rounded-full" />
              )}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {card ? (
              <>
                <div className="flex gap-2 font-medium">{card.footer}</div>
                <div className="text-base-content/60">{card.subtext}</div>
              </>
            ) : (
              <>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SectionCards;
