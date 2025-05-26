import { Row } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

interface TableSelectCellProps<T> {
  row: Row<T>;
}

const TableSelectCell = <T,>({ row }: TableSelectCellProps<T>) => (
  <div className="flex items-center justify-center">
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Seleccionar fila"
    />
  </div>
);

export default TableSelectCell;
