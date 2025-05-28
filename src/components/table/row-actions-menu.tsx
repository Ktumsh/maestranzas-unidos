import { IconDotsVertical } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface RowActionsMenuProps {
  actions: {
    label: string;
    onClick?: () => void;
    variant?: "default" | "destructive";
    showSeparator?: boolean;
  }[];
}

const RowActionsMenu = ({ actions }: RowActionsMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button size="icon" variant="ghost">
        <IconDotsVertical />
        <span className="sr-only">Abrir menú</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {actions.map((action, i) => (
        <div key={i}>
          <DropdownMenuItem
            variant={action.variant ?? "default"}
            onClick={action.onClick}
          >
            {action.label}
          </DropdownMenuItem>
          {action.showSeparator && <DropdownMenuSeparator />}
        </div>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default RowActionsMenu;
