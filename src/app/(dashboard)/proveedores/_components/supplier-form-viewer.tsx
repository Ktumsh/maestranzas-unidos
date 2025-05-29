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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  createSupplierSchema,
  type SupplierFormData,
} from "@/lib/form-schemas";

interface SupplierFormViewerProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: SupplierFormData;
  onSubmit: (data: SupplierFormData) => void | Promise<void>;
  isSubmitting: boolean;
}

const SupplierFormViewer = ({
  mode,
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: SupplierFormViewerProps) => {
  const isMobile = useIsMobile();

  const isEditing = mode === "edit";

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      name: "",
      contactEmail: "",
      contactPhone: "",
      paymentTerms: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
      });
    }
  }, [initialData, form]);

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
          <DrawerTitle>
            {mode === "edit" ? "Editar proveedor" : "Nuevo proveedor"}
          </DrawerTitle>
          <DrawerDescription>
            {mode === "edit"
              ? `Actualiza la información de ${initialData?.name}.`
              : "Crea un nuevo proveedor para el sistema."}
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            autoComplete="off"
            className="flex flex-col overflow-y-auto px-4 text-sm"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre del proveedor" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo de Contacto</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Correo del proveedor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono de Contacto</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Teléfono del proveedor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Términos de Pago</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: 30 días, Contado, Anticipo 50%"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            ) : isEditing ? (
              "Guardar cambios"
            ) : (
              "Crear proveedor"
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

export default SupplierFormViewer;
