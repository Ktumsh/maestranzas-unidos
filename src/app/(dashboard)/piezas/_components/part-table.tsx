"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IconHelpCircle, IconNut } from "@tabler/icons-react";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

import DraggableRow from "@/components/table/draggable-row";
import RowActionsMenu from "@/components/table/row-actions-menu";
import TableActionButton from "@/components/table/table-action-button";
import TableColumnToggle from "@/components/table/table-column-toggle";
import TablePaginationControls from "@/components/table/table-pagination-controls";
import TableSelectCell from "@/components/table/table-select-cell";
import TableSelectHeader from "@/components/table/table-select-header";
import { Button } from "@/components/ui/button";
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

import PartDeleteViewer from "./part-delete-viewer";
import PartDetailViewer from "./part-detail-viewer";
import PartFormViewer from "./part-form-viewer";
import PartMovementViewer from "./part-movement-viewer";
import { useGenericTable } from "../../_hooks/use-generic-table";
import { useParts } from "../../_hooks/use-parts";
import { useSortableTable } from "../../_hooks/use-sorteable-table";

import type { PartWithLocation } from "@/lib/types";

const PartTable = () => {
  const {
    parts,
    mutate,
    create,
    update,
    remove,
    registerMovement,
    selectedPart,
    setSelectedPart,
    open,
    setOpen,
    isLoading,
    isSubmitting,
  } = useParts();
  const { can } = usePermissions();

  const columns: ColumnDef<PartWithLocation>[] = [
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
      accessorKey: "image",
      header: "Imagen",
      cell: ({ row }) =>
        row.original.image ? (
          <Image
            src={row.original.image}
            alt={`Imagen de pieza ${row.original.serialNumber}`}
            width={40}
            height={40}
            className="rounded-box size-10 object-cover"
          />
        ) : (
          <div className="bg-base-100 rounded-box flex size-10 items-center justify-center">
            <span className="text-base-content/60 text-xs">
              <IconNut className="size-4" />
            </span>
          </div>
        ),
      enableSorting: false,
    },
    {
      accessorKey: "serialNumber",
      header: "N° de Serie",
      cell: ({ row }) => {
        return (
          <Button
            variant="link"
            onClick={() => {
              setSelectedPart(row.original);
              setOpen({ ...open, detail: true });
            }}
            className="text-base-content w-fit px-0 text-left"
          >
            {row.original.serialNumber}
          </Button>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => row.original.description,
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
      accessorKey: "createdAt",
      header: "Creada el",
      cell: ({ row }) =>
        formatDate(row.original.createdAt as Date, "dd MMM yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <RowActionsMenu
          actions={[
            {
              label: "Ver detalles",
              onClick: () => {
                setSelectedPart(row.original);
                setOpen({ ...open, detail: true });
              },
            },
            can("manage_parts") && {
              label: "Editar",
              onClick: () => {
                setSelectedPart(row.original);
                setOpen({ ...open, edit: true });
              },
            },
            can("create_movements") && {
              label: "Registrar movimiento",
              showSeparator: can("manage_parts"),
              onClick: () => {
                setSelectedPart(row.original);
                setOpen({ ...open, movement: true });
              },
            },
            can("manage_parts") && {
              label: "Eliminar",
              onClick: () => {
                setSelectedPart(row.original);
                setOpen({ ...open, delete: true });
              },
              variant: "destructive" as const,
            },
          ].filter(
            (
              action,
            ): action is
              | { label: string; onClick: () => void }
              | {
                  label: string;
                  variant: "destructive";
                  onClick: () => void;
                } => Boolean(action),
          )}
        />
      ),
    },
  ];

  const { table, globalFilter, setGlobalFilter } =
    useGenericTable<PartWithLocation>(parts, columns, {
      enableGlobalFilter: true,
    });

  const { sortableId, sensors, dataIds, handleDragEnd } = useSortableTable({
    data: parts,
    mutate,
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
            {can("manage_parts") && (
              <TableActionButton
                label="Añadir pieza"
                onClick={() => setOpen({ ...open, create: true })}
              />
            )}
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
      <PartFormViewer
        mode="create"
        isSubmitting={isSubmitting}
        open={open.create}
        onOpenChange={(isOpen) => setOpen({ ...open, create: isOpen })}
        onSubmit={async (data) => {
          await create(data);
          setOpen({ ...open, create: false });
        }}
      />
      <PartFormViewer
        mode="edit"
        isSubmitting={isSubmitting}
        open={open.edit}
        onOpenChange={(isOpen) => setOpen({ ...open, edit: isOpen })}
        initialData={
          selectedPart
            ? {
                ...selectedPart,
                image: selectedPart.image ?? "",
              }
            : undefined
        }
        onSubmit={async (data) => {
          if (!selectedPart) return;
          await update(selectedPart.id, data);
          setSelectedPart(null);
          setOpen({ ...open, edit: false });
        }}
      />
      <PartDeleteViewer
        open={open.delete}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedPart(null);
          setOpen({ ...open, delete: isOpen });
        }}
        part={selectedPart}
        isSubmitting={isSubmitting}
        onDelete={async () => {
          if (!selectedPart) return;
          await remove(selectedPart.id);
          setSelectedPart(null);
          setOpen({ ...open, delete: false });
        }}
      />
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
      <PartDetailViewer
        open={open.detail}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedPart(null);
          setOpen({ ...open, detail: isOpen });
        }}
        part={selectedPart}
      />
    </>
  );
};

export default PartTable;
