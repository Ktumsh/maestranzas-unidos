"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { useState } from "react";

import DraggableRow from "@/components/table/draggable-row";
import RowActionsMenu from "@/components/table/row-actions-menu";
import TableActionButton from "@/components/table/table-action-button";
import TableColumnToggle from "@/components/table/table-column-toggle";
import TablePaginationControls from "@/components/table/table-pagination-controls";
import TableSelectCell from "@/components/table/table-select-cell";
import TableSelectHeader from "@/components/table/table-select-header";
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
import { formatDate } from "@/lib/format";

import { useGenericTable } from "../_hooks/use-generic-table";
import { useSortableTable } from "../_hooks/use-sorteable-table";
import { useUsers } from "../_hooks/use-users";
import UserDeleteViewer from "./_components/user-delete-viewer";
import UserFormViewer from "./_components/user-form-viewer";

import type { User } from "@/db/schema";

export default function UserTable() {
  const { users, mutate, create, update, remove, isSubmitting } = useUsers();
  const [userToView, setUserToView] = useState<User | null>(null);
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    delete: false,
  });

  const columns: ColumnDef<User>[] = [
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
      accessorKey: "firstName",
      header: "Nombre",
      cell: ({ row }) => row.original.firstName,
      enableHiding: false,
    },
    {
      accessorKey: "lastName",
      header: "Apellido",
      cell: ({ row }) => row.original.lastName,
    },
    {
      accessorKey: "email",
      header: "Correo",
      cell: ({ row }) => row.original.email,
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.role === "admin"
              ? "admin"
              : row.original.role === "compras"
                ? "compras"
                : "bodega"
          }
          className="capitalize"
        >
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Creado el",
      cell: ({ row }) =>
        formatDate(row.original.createdAt as Date, "dd MMM yyyy"),
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
                setUserToView(row.original);
                setOpen({ ...open, edit: true });
              },
            },
            {
              label: "Eliminar",
              variant: "destructive",
              onClick: () => {
                setUserToView(row.original);
                setOpen({ ...open, delete: true });
              },
            },
          ]}
        />
      ),
    },
  ];

  const { table, globalFilter, setGlobalFilter } = useGenericTable<User>(
    users,
    columns,
    { enableGlobalFilter: true },
  );

  const { sortableId, sensors, dataIds, handleDragEnd } = useSortableTable({
    data: users,
    mutate,
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Buscar..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full max-w-72"
          />
          <div className="ms-auto flex items-center gap-2">
            <TableColumnToggle table={table} />
            <TableActionButton
              label="Agregar usuario"
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
                      Sin resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
          <TablePaginationControls table={table} />
        </div>
      </div>
      <UserFormViewer
        mode="create"
        open={open.create}
        onOpenChange={(isOpen) => setOpen({ ...open, create: isOpen })}
        onSubmit={create}
        isSubmitting={isSubmitting}
      />
      <UserFormViewer
        mode="edit"
        open={open.edit}
        onOpenChange={(isOpen) => {
          if (!isOpen) setUserToView(null);
          setOpen({ ...open, edit: isOpen });
        }}
        initialData={userToView ?? undefined}
        onSubmit={(data) =>
          userToView ? update(userToView.id, data) : undefined
        }
        isSubmitting={isSubmitting}
      />
      <UserDeleteViewer
        open={open.delete}
        onOpenChange={(isOpen) => {
          if (!isOpen) setUserToView(null);
          setOpen({ ...open, delete: isOpen });
        }}
        user={userToView}
        onDelete={async () => {
          if (!userToView) return;
          await remove(userToView.id);
          setUserToView(null);
          setOpen({ ...open, delete: false });
        }}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
