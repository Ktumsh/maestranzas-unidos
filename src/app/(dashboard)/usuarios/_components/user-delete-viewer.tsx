"use client";

import { IconLoader } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

import type { User } from "@/db/schema";

interface UserDeleteViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onDelete: () => void;
  isSubmitting: boolean;
}

const UserDeleteViewer = ({
  open,
  onOpenChange,
  user,
  onDelete,
  isSubmitting,
}: UserDeleteViewerProps) => {
  const isMobile = useIsMobile();

  const userName = user ? `${user.firstName} ${user.lastName}` : "usuario";

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-warning">Eliminar usuario</DrawerTitle>
          <DrawerDescription className="sr-only">
            Elimina al usuario seleccionado de la base de datos.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 text-center text-sm">
          ¿Estás seguro de que quieres eliminar al usuario{" "}
          <span className="text-warning font-semibold">{userName}</span>? Esta
          acción no se puede deshacer.
        </div>

        <DrawerFooter>
          <Button disabled={isSubmitting} variant="error" onClick={onDelete}>
            {isSubmitting ? (
              <IconLoader className="animate-spin" />
            ) : (
              "Confirmar eliminación"
            )}
          </Button>
          <DrawerClose asChild>
            <Button disabled={isSubmitting} outline>
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UserDeleteViewer;
