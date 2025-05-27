"use client";

import { ColumnDef, flexRender } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";

import TableColumnToggle from "@/components/table/table-column-toggle";
import TablePaginationControls from "@/components/table/table-pagination-controls";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

import { useGenericTable } from "../../_hooks/use-generic-table";
import { useReports } from "../../_hooks/use-reports";

import type { InventoryReport } from "@/db/schema";

const ReportsTable = () => {
  const { reports, isLoading } = useReports();

  const columns: ColumnDef<InventoryReport>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nombre del Reporte",
      },
      {
        accessorKey: "createdAt",
        header: "Fecha de Creación",
        cell: ({ row }) =>
          formatDate(row.original.createdAt as Date, "dd MMM yyyy"),
      },
      {
        accessorKey: "reportType",
        header: "Tipo de Reporte",
      },
      {
        id: "accion",
        header: "Acción",
        cell: ({ row }) => (
          <Link href={row.original.filePath || "#"} download>
            Descargar
          </Link>
        ),
      },
    ],
    [],
  );

  const { table, globalFilter, setGlobalFilter } =
    useGenericTable<InventoryReport>(reports, columns, {
      enableGlobalFilter: true,
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar reporte..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full max-w-72"
        />
        <div className="ms-auto flex items-center gap-2">
          <TableColumnToggle table={table} />
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

export default ReportsTable;
