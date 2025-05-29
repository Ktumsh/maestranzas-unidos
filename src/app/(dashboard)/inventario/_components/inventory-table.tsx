"use client";

import { IconHelpCircle } from "@tabler/icons-react";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

import RowActionsMenu from "@/components/table/row-actions-menu";
import TableActionButton from "@/components/table/table-action-button";
import TableColumnToggle from "@/components/table/table-column-toggle";
import TablePaginationControls from "@/components/table/table-pagination-controls";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BetterTooltip } from "@/components/ui/tooltip";
import { usePermissions } from "@/hooks/use-permissions";
import { formatDate } from "@/lib/format";

import { useGenericTable } from "../../_hooks/use-generic-table";
import { useParts } from "../../_hooks/use-parts";
import PartDetailViewer from "../../piezas/_components/part-detail-viewer";
import PartMovementViewer from "../../piezas/_components/part-movement-viewer";

import type { PartWithLocation } from "@/lib/types";

const InventoryTable = () => {
  const {
    parts,
    generateReport,
    registerMovement,
    isSubmitting,
    selectedPart,
    setSelectedPart,
    isLoading,
    open,
    setOpen,
  } = useParts();

  const { can } = usePermissions();

  const columns: ColumnDef<PartWithLocation>[] = [
    {
      accessorKey: "image",
      header: "Imagen",
      cell: ({ row }) =>
        row.original.image ? (
          <Image
            src={row.original.image}
            alt={`Imagen de pieza ${row.original.serialNumber}`}
            width={40}
            height={40}
            className="size-10 rounded object-cover"
          />
        ) : (
          <span className="text-base-content/60 text-xs italic">
            Sin imagen
          </span>
        ),
      enableSorting: false,
    },
    {
      accessorKey: "serialNumber",
      header: "N° de Serie",
      cell: ({ row }) => {
        return <PartDetailViewer part={row.original} />;
      },
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "resolvedLocation",
      header: () => (
        <div className="flex items-center gap-1">
          <span>Ubicación</span>
          <BetterTooltip
            content="Click para más información sobre ubicaciones"
            delayDuration={0}
          >
            <Link href="/mapa" target="_blank">
              <IconHelpCircle className="size-4" />
            </Link>
          </BetterTooltip>
        </div>
      ),
      cell: ({ row }) => row.original.resolvedLocation,
    },
    {
      accessorKey: "stock",
      header: "Stock Actual",
      cell: ({ row }) => row.original.stock ?? 0,
    },
    {
      accessorKey: "minStock",
      header: "Stock Mínimo",
      cell: ({ row }) => row.original.minStock ?? 0,
    },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const { stock, minStock } = row.original;
        const isLow = stock < minStock;
        return (
          <Badge variant={isLow ? "error" : "success"}>
            {isLow ? "Stock bajo" : "Normal"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Creada el",
      cell: ({ row }) =>
        formatDate(row.original.createdAt as Date, "dd MMM yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) =>
        can("create_movements") && (
          <RowActionsMenu
            actions={[
              {
                label: "Registrar movimiento",
                onClick: () => {
                  setSelectedPart(row.original);
                  setOpen({ ...open, movement: true });
                },
              },
            ]}
          />
        ),
    },
  ];

  const { table, globalFilter, setGlobalFilter } =
    useGenericTable<PartWithLocation>(parts, columns, {
      enableGlobalFilter: true,
    });

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Buscar pieza..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full max-w-72"
          />
          <div className="ms-auto flex items-center gap-2">
            <TableColumnToggle table={table} />
            {can("generate_reports") && (
              <TableActionButton
                label="Generar reporte"
                onClick={generateReport}
              />
            )}
          </div>
        </div>

        <div className="relative flex flex-col gap-4 overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-auto">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {isLoading ? "Cargando..." : "Sin resultados."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePaginationControls table={table} withSelect={false} />
        </div>
      </div>
      <PartMovementViewer
        open={open.movement}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedPart(null);
          setOpen({ ...open, movement: isOpen });
        }}
        serialNumber={selectedPart?.serialNumber}
        isSubmitting={isSubmitting}
        onSubmit={async (data) => {
          if (!selectedPart) return;
          await registerMovement(selectedPart.id, data);
          setSelectedPart(null);
          setOpen({ ...open, movement: false });
        }}
      />
    </>
  );
};

export default InventoryTable;
