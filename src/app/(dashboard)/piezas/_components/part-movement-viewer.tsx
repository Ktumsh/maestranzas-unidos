"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { movementSchema, type PartMovementFormData } from "@/lib/form-schemas";

import { useSuppliers } from "../../_hooks/use-suppliers";

interface PartMovementViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serialNumber?: string;
  onSubmit: (data: PartMovementFormData) => void | Promise<void>;
  isSubmitting: boolean;
}

const PartMovementViewer = ({
  open,
  onOpenChange,
  serialNumber,
  onSubmit,
  isSubmitting,
}: PartMovementViewerProps) => {
  const { suppliers, isLoading } = useSuppliers();
  const isMobile = useIsMobile();

  const form = useForm<PartMovementFormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      type: "salida",
      quantity: 1,
      reason: "",
      supplierId: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) {
      form.reset({ type: "salida", quantity: 1, reason: "" });
    }
  }, [open, form]);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
      repositionInputs={false}
      handleOnly={!isMobile}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Registrar movimiento</DrawerTitle>
          <DrawerDescription>
            Registra una entrada o salida del inventario.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form className="flex flex-col px-4 py-2 text-sm" autoComplete="off">
            {serialNumber && (
              <div className="mb-4 text-sm">
                N° de serie:{" "}
                <span className="text-info font-semibold">{serialNumber}</span>
              </div>
            )}

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="salida">Salida</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: Uso en maquinaria, ingreso por proveedor..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("type") === "entrada" && (
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          disabled={isLoading || !suppliers.length}
                          className="w-full"
                        >
                          <SelectValue placeholder="Selecciona un proveedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
        <DrawerFooter>
          <Button
            disabled={isSubmitting}
            variant="primary"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? (
              <IconLoader className="animate-spin" />
            ) : (
              "Registrar movimiento"
            )}
          </Button>
          <DrawerClose asChild>
            <Button outline type="button" disabled={isSubmitting}>
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PartMovementViewer;
