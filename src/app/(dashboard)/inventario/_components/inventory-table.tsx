"use client";

import { ColumnDef, flexRender } from "@tanstack/react-table";
import { useMemo } from "react";

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
import { usePermissions } from "@/hooks/use-permissions";
import { formatDate } from "@/lib/format";

import { useGenericTable } from "../../_hooks/use-generic-table";
import { useParts } from "../../_hooks/use-parts";

import type { Part } from "@/db/schema";

const InventoryTable = () => {
  const { parts, generateReport, isLoading } = useParts();

  const { can } = usePermissions();

  const columns: ColumnDef<Part>[] = useMemo(
    () => [
      {
        accessorKey: "serialNumber",
        header: "N° de Serie",
        enableHiding: false,
      },
      {
        accessorKey: "description",
        header: "Descripción",
      },
      {
        accessorKey: "location",
        header: "Ubicación",
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
    ],
    [],
  );

  const { table, globalFilter, setGlobalFilter } = useGenericTable<Part>(
    parts,
    columns,
    { enableGlobalFilter: true },
  );

  return (
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
        <TablePaginationControls table={table} />
      </div>
    </div>
  );
};

export default InventoryTable;
