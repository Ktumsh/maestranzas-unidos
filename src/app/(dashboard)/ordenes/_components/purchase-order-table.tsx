"use client";

import { ColumnDef, flexRender } from "@tanstack/react-table";

import RowActionsMenu from "@/components/table/row-actions-menu";
import TableActionButton from "@/components/table/table-action-button";
import TableColumnToggle from "@/components/table/table-column-toggle";
import TablePaginationControls from "@/components/table/table-pagination-controls";
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
import { usePermissions } from "@/hooks/use-permissions";
import { formatDate } from "@/lib/format";
import { PurchaseOrderWithItems } from "@/lib/types";

import PurchaseOrderDeleteViewer from "./purchase-order-delete-viewer";
import PurchaseOrderDetailViewer from "./purchase-order-detail-viewer";
import PurchaseOrderFormViewer from "./purchase-order-form-viewer";
import PurchaseOrderStatusCell from "./purchase-order-status-cell";
import { useGenericTable } from "../../_hooks/use-generic-table";
import { useParts } from "../../_hooks/use-parts";
import { usePurchaseOrders } from "../../_hooks/use-purchase-orders";
import { useSuppliers } from "../../_hooks/use-suppliers";

const PurchaseOrderTable = () => {
  const {
    orders,
    create,
    remove,
    selectedOrder,
    setSelectedOrder,
    open,
    setOpen,
    isLoading,
    isSubmitting,
  } = usePurchaseOrders();

  const { parts } = useParts();
  const { suppliers } = useSuppliers();

  const { can } = usePermissions();

  const columns: ColumnDef<PurchaseOrderWithItems>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <Button
          variant="link"
          onClick={() => {
            setSelectedOrder(row.original);
            setOpen({ ...open, view: true });
          }}
          className="text-base-content w-fit px-0 text-left uppercase"
        >
          #{row.original.id.slice(0, 8)}
        </Button>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) =>
        row.original.createdAt
          ? formatDate(row.original.createdAt, "dd MMM yyyy")
          : "—",
    },
    {
      accessorKey: "supplier.name",
      header: "Proveedor",
      cell: ({ row }) => row.original.supplier?.name ?? "Desconocido",
    },
    {
      accessorKey: "items",
      header: "Piezas",
      cell: ({ row }) => row.original.items?.length ?? 0,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <PurchaseOrderStatusCell
          id={row.original.id}
          initialStatus={row.original.status ?? "pendiente"}
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <RowActionsMenu
          actions={[
            {
              label: "Ver detalles",
              showSeparator: true,
              onClick: () => {
                setSelectedOrder(row.original);
                setOpen({ ...open, view: true });
              },
            },
            {
              label: "Eliminar",
              variant: "destructive",
              onClick: () => {
                setSelectedOrder(row.original);
                setOpen({ ...open, delete: true });
              },
            },
          ]}
        />
      ),
    },
  ];

  const { table, globalFilter, setGlobalFilter } =
    useGenericTable<PurchaseOrderWithItems>(orders, columns, {
      enableGlobalFilter: true,
    });

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Buscar orden..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full max-w-72"
          />
          <div className="ms-auto flex items-center gap-2">
            <TableColumnToggle table={table} />
            {can("create_purchase_orders") && (
              <TableActionButton
                label="Nueva Orden"
                disabled={suppliers.length === 0 || parts.length === 0}
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
          <TablePaginationControls table={table} />
        </div>
      </div>

      <PurchaseOrderFormViewer
        open={open.create}
        onOpenChange={(isOpen) => setOpen({ ...open, create: isOpen })}
        isSubmitting={isSubmitting}
        onSubmit={async (data) => {
          await create(data);
          setOpen({ ...open, create: false });
        }}
        suppliers={suppliers}
        parts={parts}
      />
      <PurchaseOrderDetailViewer
        open={open.view}
        onOpenChange={(isOpen) => setOpen({ ...open, view: isOpen })}
        order={selectedOrder}
      />
      <PurchaseOrderDeleteViewer
        open={open.delete}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedOrder(null);
          setOpen({ ...open, delete: isOpen });
        }}
        order={selectedOrder}
        isSubmitting={isSubmitting}
        onDelete={async () => {
          if (!selectedOrder?.id) return;
          await remove(selectedOrder.id);
          setSelectedOrder(null);
          setOpen({ ...open, delete: false });
        }}
      />
    </>
  );
};

export default PurchaseOrderTable;
