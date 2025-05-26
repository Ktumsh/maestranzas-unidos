"use client";

import { IconPlus } from "@tabler/icons-react";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface TableActionButtonProps {
  onClick?: () => void;
  label?: string;
  icon?: ReactNode;
}

const TableActionButton = ({
  onClick,
  label = "Agregar",
  icon = <IconPlus />,
}: TableActionButtonProps) => {
  const isMobile = useIsMobile();

  return (
    <Button variant="primary" size={isMobile ? "icon" : "sm"} onClick={onClick}>
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </Button>
  );
};

export default TableActionButton;
