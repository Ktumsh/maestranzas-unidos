"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import HeaderMap from "./header-map";
import Legend from "./legend";
import Shelf from "./shelf";
import { useLocations } from "../../_hooks/use-locations";
import { getX, getY, warehouseColors, WarehouseName } from "../../_lib/utils";

const warehouseLayout: { name: WarehouseName; style: React.CSSProperties }[] = [
  {
    name: "Bodega Norte",
    style: { left: "5%", top: "22%", width: "40%", height: "25%" },
  },
  {
    name: "Bodega Sur",
    style: { left: "5%", bottom: "22%", width: "25%", height: "25%" },
  },
  {
    name: "Bodega Central",
    style: { left: "38%", bottom: "22%", width: "25%", height: "25%" },
  },
  {
    name: "Bodega Este",
    style: { right: "5%", top: "22%", width: "40%", height: "25%" },
  },
];

export default function WarehouseMap() {
  const { locations, isLoading } = useLocations();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span>Cargando mapa de bodegas...</span>
      </div>
    );
  }

  // Agrupar los shelf únicos por bodega
  const uniqueShelves = Object.entries(
    locations.reduce(
      (acc, loc) => {
        const shelfId = loc.shelf.split(" - ")[0];
        const key = `${loc.warehouse}-${shelfId}`;
        if (!acc[key]) acc[key] = { warehouse: loc.warehouse, shelfId };
        return acc;
      },
      {} as Record<string, { warehouse: string; shelfId: string }>,
    ),
  );

  return (
    <div className="bg-base-100 rounded-box p-3 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        {/* Header */}
        <HeaderMap />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4">
          {/* Leyenda */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <Legend />
          </div>

          {/* Mapa Principal */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            <Card className="py-0">
              <CardContent className="p-0">
                <div className="bg-base-300 rounded-box relative h-[400px] w-full border-2 sm:h-[500px] md:h-[600px] lg:h-[700px]">
                  {/* Área de Oficinas */}
                  <div className="border-info bg-info/20 absolute top-1 right-1 left-1 flex h-8 items-center justify-center rounded border-2 sm:top-2 sm:right-2 sm:left-2 sm:h-12">
                    <span className="text-info text-xs font-semibold sm:text-sm">
                      ÁREA DE OFICINAS Y RECEPCIÓN
                    </span>
                  </div>

                  {/* Pasillos principales */}
                  <div className="bg-neutral/70 absolute top-10 right-1 left-1 h-2 border sm:top-16 sm:right-2 sm:left-2 sm:h-4" />
                  <div className="bg-neutral/70 absolute top-10 bottom-10 left-1/2 w-2 -translate-x-1/2 border sm:top-16 sm:bottom-16 sm:w-4" />
                  <div className="bg-neutral/70 absolute right-1 bottom-10 left-1 h-2 border sm:right-2 sm:bottom-16 sm:left-2 sm:h-4" />

                  {/* Contornos de las bodegas */}
                  {warehouseLayout.map(({ name, style }) => (
                    <div
                      key={name}
                      className={cn(
                        "absolute rounded-lg border-2 border-dashed",
                        warehouseColors.border[name],
                      )}
                      style={style}
                    >
                      <div
                        className={cn(
                          "absolute -top-2 left-2 z-20 rounded-full px-2 py-0.5 text-xs font-bold text-white shadow-md sm:-top-3 sm:left-4 sm:px-3 sm:py-1 sm:text-sm",
                          warehouseColors.background[name],
                          warehouseColors.text[name],
                        )}
                      >
                        {name.toUpperCase()}
                      </div>
                    </div>
                  ))}
                  {/* Estanterías */}
                  {uniqueShelves.map(([key, { warehouse, shelfId }]) => (
                    <Shelf
                      key={key}
                      locations={locations}
                      warehouse={warehouse}
                      shelfId={shelfId}
                      x={getX(warehouse, shelfId)}
                      y={getY(warehouse, shelfId)}
                    />
                  ))}

                  {/* Área de carga / salidas */}
                  <div className="border-warning bg-warning/20 absolute right-1 bottom-1 left-1 flex h-8 items-center justify-center rounded border-2 sm:right-2 sm:bottom-2 sm:left-2 sm:h-12">
                    <div className="text-center">
                      <span className="text-warning text-xs font-semibold sm:text-sm">
                        ÁREA DE CARGA Y DESCARGA
                      </span>
                      <div className="text-warning/80 hidden text-xs sm:block">
                        Acceso de vehículos pesados
                      </div>
                    </div>
                  </div>
                  <div className="bg-error absolute top-1/2 left-0 flex h-12 w-2 -translate-y-1/2 items-center justify-center sm:h-16 sm:w-3.5">
                    <span className="text-error-content -rotate-90 text-xs font-bold tracking-widest">
                      SALIDA
                    </span>
                  </div>
                  <div className="bg-error absolute top-1/2 right-0 flex h-12 w-2 -translate-y-1/2 items-center justify-center sm:h-16 sm:w-3.5">
                    <span className="text-error-content -rotate-90 text-xs font-bold tracking-widest">
                      SALIDA
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
