"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ColumnDef, flexRender } from "@tanstack/react-table";

import DraggableRow from "@/components/table/draggable-row";
import RowActionsMenu from "@/components/table/row-actions-menu";
import TableActionButton from "@/components/table/table-action-button";
import TableColumnToggle from "@/components/table/table-column-toggle";
import TablePaginationControls from "@/components/table/table-pagination-controls";
import TableSelectCell from "@/components/table/table-select-cell";
import TableSelectHeader from "@/components/table/table-select-header";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import SupplierDeleteViewer from "./supplier-delete-viewer";
import SupplierFormViewer from "./supplier-form-viewer";
import { useGenericTable } from "../../_hooks/use-generic-table";
import { useSortableTable } from "../../_hooks/use-sorteable-table";
import { useSuppliers } from "../../_hooks/use-suppliers";

import type { Supplier } from "@/db/schema";

const SupplierTable = () => {
  const {
    suppliers,
    mutate,
    isLoading,
    isSubmitting,
    create,
    update,
    remove,
    open,
    setOpen,
    selectedSupplier,
    setSelectedSupplier,
  } = useSuppliers();

  const columns: ColumnDef<Supplier>[] = [
    {
      id: "drag",
      header: () => null,
      cell: () => null,
    },
    {
      id: "select",
      header: ({ table }) => <TableSelectHeader table={table} />,
      cell: ({ row }) => <TableSelectCell row={row} />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "contactEmail",
      header: "Correo de Contacto",
      cell: ({ row }) => row.original.contactEmail,
    },
    {
      accessorKey: "contactPhone",
      header: "Teléfono de Contacto",
      cell: ({ row }) => row.original.contactPhone,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <RowActionsMenu
          actions={[
            {
              label: "Editar",
              showSeparator: true,
              onClick: () => {
                setSelectedSupplier(row.original);
                setOpen({ ...open, edit: true });
              },
            },
            {
              label: "Eliminar",
              variant: "destructive",
              onClick: () => {
                setSelectedSupplier(row.original);
                setOpen({ ...open, delete: true });
              },
            },
          ]}
        />
      ),
    },
  ];

  const { table, globalFilter, setGlobalFilter } = useGenericTable<Supplier>(
    suppliers,
    columns,
    { enableGlobalFilter: true },
  );

  const { sortableId, sensors, dataIds, handleDragEnd } = useSortableTable({
    data: suppliers,
    mutate,
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Buscar proveedor..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full max-w-72"
          />
          <div className="ms-auto flex items-center gap-2">
            <TableColumnToggle table={table} />
            <TableActionButton
              label="Agregar proveedor"
              onClick={() => setOpen({ ...open, create: true })}
            />
          </div>
        </div>

        <div className="relative flex flex-col gap-4 overflow-auto">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
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
              <TableBody>
                {table.getRowModel().rows.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
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
          </DndContext>
          <TablePaginationControls table={table} />
        </div>
      </div>
      <SupplierFormViewer
        mode="create"
        open={open.create}
        onOpenChange={(isOpen) => setOpen({ ...open, create: isOpen })}
        onSubmit={create}
        isSubmitting={isSubmitting}
      />
      <SupplierFormViewer
        mode="edit"
        open={open.edit}
        onOpenChange={(isOpen) => setOpen({ ...open, edit: isOpen })}
        initialData={
          selectedSupplier
            ? {
                name: selectedSupplier.name,
                contactEmail: selectedSupplier.contactEmail ?? "",
                contactPhone: selectedSupplier.contactPhone ?? "",
              }
            : undefined
        }
        onSubmit={async (data) => {
          if (!selectedSupplier) return;
          await update(selectedSupplier.id, data);
          setSelectedSupplier(null);
          setOpen({ ...open, edit: false });
        }}
        isSubmitting={isSubmitting}
      />
      <SupplierDeleteViewer
        open={open.delete}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedSupplier(null);
          setOpen({ ...open, delete: isOpen });
        }}
        supplier={selectedSupplier}
        onDelete={async () => {
          if (!selectedSupplier) return;
          await remove(selectedSupplier.id);
          setSelectedSupplier(null);
          setOpen({ ...open, delete: false });
        }}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default SupplierTable;
