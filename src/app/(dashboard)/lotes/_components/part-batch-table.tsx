"use client";

import { IconNut } from "@tabler/icons-react";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import Image from "next/image";

import RowActionsMenu from "@/components/table/row-actions-menu";
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
import { usePermissions } from "@/hooks/use-permissions";
import { formatDate } from "@/lib/format";

import PartBatchDeleteViewer from "./part-batch-delete-viewer";
import PartBatchFormViewer from "./part-batch-form-viewer";
import { useGenericTable } from "../../_hooks/use-generic-table";
import { usePartBatches } from "../../_hooks/use-part-batches";
import { useParts } from "../../_hooks/use-parts";

import type { PartBatchWithPart } from "@/lib/types";

const PartBatchTable = () => {
  const {
    batches,
    create,
    update,
    remove,
    selectedBatch,
    setSelectedBatch,
    open,
    setOpen,
    isLoading,
    isSubmitting,
  } = usePartBatches();

  const { parts } = useParts();
  const { can } = usePermissions();

  const columns: ColumnDef<PartBatchWithPart>[] = [
    {
      accessorKey: "serialNumber",
      header: "Pieza relacionada",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.part?.image ? (
            <Image
              src={row.original.part.image}
              alt="Imagen de la pieza"
              width={32}
              height={32}
              className="rounded-box size-8 object-cover"
            />
          ) : (
            <div className="bg-base-100 rounded-box flex size-8 items-center justify-center">
              <span className="text-base-content/60 text-xs">
                <IconNut className="size-4" />
              </span>
            </div>
          )}{" "}
          <span className="font-medium">{row.original.part?.serialNumber}</span>
        </div>
      ),
    },
    {
      accessorKey: "batchCode",
      header: "Código de Lote",
      cell: ({ row }) => row.original.batchCode ?? "—",
    },
    {
      accessorKey: "quantity",
      header: "Cantidad",
    },
    {
      accessorKey: "expirationDate",
      header: "Vence",
      cell: ({ row }) =>
        row.original.expirationDate
          ? formatDate(row.original.expirationDate, "dd MMM yyyy")
          : "—",
    },
    {
      id: "actions",
      cell: ({ row }) =>
        can("manage_part_batches") && (
          <RowActionsMenu
            actions={[
              {
                label: "Editar",
                showSeparator: true,
                onClick: () => {
                  setSelectedBatch(row.original);
                  setOpen({ ...open, edit: true });
                },
              },
              {
                label: "Eliminar",
                variant: "destructive",
                onClick: () => {
                  setSelectedBatch(row.original);
                  setOpen({ ...open, delete: true });
                },
              },
            ]}
          />
        ),
    },
  ];

  const { table, globalFilter, setGlobalFilter } =
    useGenericTable<PartBatchWithPart>(batches, columns, {
      enableGlobalFilter: true,
    });

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Buscar lote..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full max-w-72"
          />
          <div className="ms-auto flex items-center gap-2">
            <TableColumnToggle table={table} />
            {can("manage_part_batches") && (
              <TableActionButton
                label="Nuevo Lote"
                disabled={parts.length === 0}
                onClick={() => setOpen({ ...open, create: true })}
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

      <PartBatchFormViewer
        mode="create"
        open={open.create}
        onOpenChange={() => setOpen({ ...open, create: false })}
        parts={parts}
        onSubmit={async (data) => {
          await create(data);
          setOpen({ ...open, create: false });
        }}
        isSubmitting={isSubmitting}
      />

      <PartBatchFormViewer
        mode="edit"
        open={open.edit}
        onOpenChange={() => setOpen({ ...open, edit: false })}
        parts={parts}
        initialData={
          selectedBatch
            ? {
                partId: selectedBatch.partId,
                batchCode: selectedBatch.batchCode ?? "",
                quantity: selectedBatch.quantity,
                expirationDate: selectedBatch.expirationDate ?? undefined,
              }
            : undefined
        }
        onSubmit={async (data) => {
          if (!selectedBatch) return;
          await update(selectedBatch.id, data);
          setOpen({ ...open, edit: false });
        }}
        isSubmitting={isSubmitting}
      />
      <PartBatchDeleteViewer
        open={open.delete}
        onOpenChange={() => setOpen({ ...open, delete: false })}
        batch={selectedBatch}
        onDelete={async () => {
          if (!selectedBatch) return;
          await remove(selectedBatch.id);
          setOpen({ ...open, delete: false });
        }}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default PartBatchTable;
