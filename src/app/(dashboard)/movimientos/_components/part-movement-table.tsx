"use client";

import { ColumnDef, flexRender } from "@tanstack/react-table";

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
import { usePartMovements } from "../../_hooks/use-part-movements";

import type { PartMovement } from "@/db/schema";

const PartMovementTable = () => {
  const { movements, isLoading } = usePartMovements();

  const columns: ColumnDef<
    PartMovement & {
      serialNumber?: string;
      userEmail?: string;
    }
  >[] = [
    {
      accessorKey: "serialNumber",
      header: "N° de Serie",
      cell: ({ row }) => row.original.serialNumber ?? "—",
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => {
        const t = row.original.type;
        const label =
          t === "salida"
            ? "Salida"
            : t === "entrada"
              ? "Entrada"
              : t === "transferencia"
                ? "Transferencia"
                : "Uso en proyecto";
        return <span className="capitalize">{label}</span>;
      },
    },
    {
      accessorKey: "quantity",
      header: "Cantidad",
      cell: ({ row }) => row.original.quantity,
    },
    {
      accessorKey: "reason",
      header: "Motivo",
      cell: ({ row }) => row.original.reason ?? "—",
    },
    {
      accessorKey: "userEmail",
      header: "Registrado por",
      cell: ({ row }) => row.original.userEmail ?? "—",
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) =>
        formatDate(row.original.createdAt as Date, "dd MMM yyyy HH:mm"),
    },
  ];

  const { table, globalFilter, setGlobalFilter } = useGenericTable(
    movements,
    columns,
    {
      enableGlobalFilter: true,
    },
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar movimiento..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full max-w-72"
        />
        <div className="ms-auto">
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
                  {isLoading ? "Cargando..." : "Sin resultados"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePaginationControls table={table} withSelect={false} />
      </div>
    </div>
  );
};

export default PartMovementTable;
