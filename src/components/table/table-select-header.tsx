import { Table } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

interface TableSelectHeaderProps<T> {
  table: Table<T>;
}

const TableSelectHeader = <T,>({ table }: TableSelectHeaderProps<T>) => (
  <div className="flex items-center justify-center">
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Seleccionar todo"
    />
  </div>
);

export default TableSelectHeader;
