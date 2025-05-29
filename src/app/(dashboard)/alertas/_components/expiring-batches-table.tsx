"use client";

import { IconNut, IconRefresh } from "@tabler/icons-react";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import Image from "next/image";

import TableActionButton from "@/components/table/table-action-button";
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

import { useBatchAlerts } from "../../_hooks/use-batch-alerts";
import { useGenericTable } from "../../_hooks/use-generic-table";

import type { ExpiringBatchAlert } from "@/lib/types";

const ExpiringBatchesTable = () => {
  const { alerts, isLoading, handleCheck, loadingCheck } = useBatchAlerts();

  const columns: ColumnDef<ExpiringBatchAlert>[] = [
    {
      accessorKey: "batchCode",
      header: "Código de Lote",
      cell: ({ row }) => row.original.batchCode,
    },
    {
      accessorKey: "serialNumber",
      header: "Pieza relacionada",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.image ? (
            <Image
              src={row.original.image}
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
          <span className="font-medium">{row.original.serialNumber}</span>
        </div>
      ),
    },
    {
      accessorKey: "expirationDate",
      header: "Fecha de Vencimiento",
      cell: ({ row }) =>
        formatDate(row.original.expirationDate as Date, "dd MMM yyyy"),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Alerta",
      cell: ({ row }) =>
        formatDate(row.original.createdAt as Date, "dd MMM yyyy"),
    },
  ];

  const { table, globalFilter, setGlobalFilter } =
    useGenericTable<ExpiringBatchAlert>(alerts, columns, {
      enableGlobalFilter: true,
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar alerta... (Lotes por vencer)"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full max-w-72"
        />
        <div className="ms-auto flex items-center gap-2">
          <TableColumnToggle table={table} />
          <TableActionButton
            disabled={loadingCheck}
            label="Actualizar lotes por vencer"
            icon={<IconRefresh />}
            onClick={handleCheck}
          />
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

export default ExpiringBatchesTable;
