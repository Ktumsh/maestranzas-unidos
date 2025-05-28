"use client";

import { IconX } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { warehouseColors, type WarehouseName } from "../../_lib/utils";

import type { Location } from "@/db/schema";

interface ShelfProps {
  locations: Array<Location>;
  warehouse: string;
  shelfId: string;
  x: number;
  y: number;
}

const Shelf = ({ locations, warehouse, shelfId, x, y }: ShelfProps) => {
  const [hoveredShelf, setHoveredShelf] = useState<string | null>(null);
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);

  const getShelfInfo = (warehouse: string, shelfId: string) => {
    return locations.filter(
      (loc) => loc.warehouse === warehouse && loc.shelf.startsWith(shelfId),
    );
  };

  const key = `${warehouse}-${shelfId}`;
  const isHovered = hoveredShelf === key;
  const isSelected = selectedShelf === key;
  const backgroundColor =
    warehouseColors.background[warehouse as WarehouseName];
  const borderColor = warehouseColors.border[warehouse as WarehouseName];
  const textColor = warehouseColors.accentText[warehouse as WarehouseName];
  const shelfInfo = getShelfInfo(warehouse, shelfId);

  return (
    <div
      key={key}
      className={cn(
        "absolute w-10 sm:w-12 md:w-14",
        isHovered || isSelected ? "z-50" : "z-10",
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      {/* Estantería */}
      <div
        className={cn(
          "relative size-full cursor-pointer transition-all duration-200",
          {
            "scale-110": isHovered || isSelected,
          },
        )}
        onMouseEnter={() => setHoveredShelf(key)}
        onMouseLeave={() => setHoveredShelf(null)}
        onClick={() => setSelectedShelf(isSelected ? null : key)}
      >
        {/* Estructura de la estantería */}
        <div
          className={cn(
            "size-full rounded-sm border-2 shadow-lg",
            isHovered || isSelected
              ? "border-accent shadow-xl"
              : "border-neutral",
          )}
        >
          {/* Niveles de la estantería */}
          <div className="flex h-full flex-col justify-between p-0.5 sm:p-1">
            {shelfInfo.map((loc, i) => (
              <div
                key={i}
                className={cn(
                  "mb-0.5 flex flex-1 items-center justify-center border text-xs font-bold transition-colors duration-200 last:mb-0 sm:mb-1",
                  {
                    "bg-accent text-accent-content": isHovered || isSelected,
                    "bg-neutral text-neutral-content": !(
                      isHovered || isSelected
                    ),
                  },
                )}
              >
                <span className="text-center leading-tight">
                  {shelfId}
                  <br />
                  <span className="text-xs opacity-70">
                    {"N" + loc.shelf.split("Nivel ")[1]}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Etiqueta de identificación */}
        <div
          className={cn(
            "absolute -top-5 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-xs font-bold shadow-md transition-all duration-200 sm:-top-7 sm:px-3 sm:py-1 sm:text-sm",
            {
              "bg-accent text-accent-content scale-110":
                isHovered || isSelected,
              "border-neutral bg-base-content text-base-300 border-2": !(
                isHovered || isSelected
              ),
            },
          )}
        >
          {shelfId}
        </div>
      </div>

      {/* Tooltip con información detallada */}
      {(isHovered || isSelected) && shelfInfo.length > 0 && (
        <div
          className="bg-base-100 rounded-box absolute w-64 border-2 p-3 shadow-2xl sm:w-72 sm:p-4 md:w-80"
          style={{
            left: x > 70 ? "-110%" : "110%",
            top: "0",
            maxWidth: "calc(100vw - 2rem)",
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <div className={cn("size-3 rounded sm:size-4", backgroundColor)} />
            <h3 className="text-sm font-bold sm:text-lg">
              Estantería {shelfId}
            </h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {shelfInfo.map((loc, i) => (
              <div
                key={i}
                className={cn(
                  "border-l-4 pl-2 text-xs sm:pl-3 sm:text-sm",
                  borderColor,
                )}
              >
                <div className={cn("font-semibold", textColor)}>
                  {loc.shelf}
                </div>
                <div className="text-base-content/80">{loc.description}</div>
              </div>
            ))}
          </div>
          {isSelected && (
            <Button
              outline
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedShelf(null);
              }}
              className="absolute top-1 right-1 p-0 sm:top-2 sm:right-2"
            >
              <IconX />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Shelf;
