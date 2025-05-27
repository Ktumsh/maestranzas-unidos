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
  createPartSchema,
  editPartSchema,
  type PartFormData,
  type EditPartFormData,
} from "@/lib/form-schemas";

interface PartFormViewerProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: PartFormData;
  onSubmit: (data: PartFormData | EditPartFormData) => void | Promise<void>;
  isSubmitting: boolean;
}

const PartFormViewer = ({
  mode,
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: PartFormViewerProps) => {
  const isMobile = useIsMobile();
  const isEditing = mode === "edit";

  const form = useForm<PartFormData | EditPartFormData>({
    resolver: zodResolver(isEditing ? editPartSchema : createPartSchema),
    defaultValues: {
      serialNumber: "",
      description: "",
      location: "",
      minStock: 0,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
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
            {isEditing ? "Editar pieza" : "Nueva pieza"}
          </DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? `Actualiza la información de la pieza ${initialData?.serialNumber}.`
              : "Registra una nueva pieza del inventario."}
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form className="flex flex-col px-4 py-2 text-sm" autoComplete="off">
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de serie</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: PZA-10034"
                      {...field}
                      disabled={isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Motor hidráulico de repuesto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Bodega Norte - Estante 3B"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock mínimo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: 5"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericValue =
                          value === "" ? "" : parseInt(value, 10);
                        field.onChange(numericValue);
                      }}
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
              "Registrar pieza"
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

export default PartFormViewer;
