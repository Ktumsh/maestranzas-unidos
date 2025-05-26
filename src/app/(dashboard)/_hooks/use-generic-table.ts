"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type TableOptions,
} from "@tanstack/react-table";
import { useState } from "react";

interface UseGenericTableOptions<T> {
  enableGlobalFilter?: boolean;
  getRowId?: TableOptions<T>["getRowId"];
  enableRowSelection?: boolean;
}

export function useGenericTable<T>(
  data: T[],
  columns: ColumnDef<T>[],
  options: UseGenericTableOptions<T> = {},
) {
  const {
    enableGlobalFilter = false,
    getRowId,
    enableRowSelection = false,
  } = options;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      ...(enableGlobalFilter && { globalFilter }),
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    ...(enableGlobalFilter && {
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: "includesString",
    }),
    ...(getRowId && { getRowId }),
    ...(enableRowSelection && { enableRowSelection }),
  });

  return {
    table,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
  };
}
