"use client";

import { IconChevronDown, IconLayoutColumns } from "@tabler/icons-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatToCapitalize } from "@/lib/format";

interface TableColumnToggleProps<T> {
  table: Table<T>;
  buttonText?: string;
}

const TableColumnToggle = <T,>({
  table,
  buttonText = "Personalizar columnas",
}: TableColumnToggleProps<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button outline size="sm">
          <IconLayoutColumns />
          <span className="hidden lg:inline">{buttonText}</span>
          <span className="lg:hidden">Columnas</span>
          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {formatToCapitalize(
                typeof column.columnDef.header === "string"
                  ? column.columnDef.header
                  : column.id,
              )}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableColumnToggle;
