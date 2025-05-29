"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader, IconNut } from "@tabler/icons-react";
import Image from "next/image";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { partBatchSchema, type PartBatchFormData } from "@/lib/form-schemas";

import type { Part } from "@/db/schema";

interface Props {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PartBatchFormData) => void;
  isSubmitting: boolean;
  parts: Array<Part>;
  initialData?: PartBatchFormData;
}

const PartBatchFormViewer = ({
  mode,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  parts,
  initialData,
}: Props) => {
  const isMobile = useIsMobile();
  const isEditing = mode === "edit";

  const form = useForm<PartBatchFormData>({
    resolver: zodResolver(partBatchSchema),
    defaultValues: {
      partId: "",
      batchCode: "",
      quantity: 1,
      expirationDate: undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else if (!open) {
      form.reset();
    }
  }, [initialData, open, form]);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{isEditing ? "Editar lote" : "Nuevo lote"}</DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? `Modifica la información del lote asociado a la pieza seleccionada.`
              : "Ingresa la información del lote y su fecha de vencimiento si corresponde."}
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            className="flex flex-col overflow-y-auto px-4 py-2 text-sm"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="batchCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código del lote</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: LOTE-2024-01" />
                  </FormControl>
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
              name="expirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de vencimiento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pieza asociada</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isEditing}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una pieza" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parts.map((part) => (
                        <SelectItem key={part.id} value={part.id}>
                          {part.image ? (
                            <Image
                              src={part.image}
                              alt="Imagen de la pieza"
                              width={24}
                              height={24}
                              className="rounded-box h-6 w-auto object-cover"
                            />
                          ) : (
                            <div className="bg-base-300 rounded-box flex size-6 items-center justify-center">
                              <span className="text-base-content/60 text-xs">
                                <IconNut className="size-4" />
                              </span>
                            </div>
                          )}
                          {part.serialNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DrawerFooter>
          <Button
            variant="primary"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? (
              <IconLoader className="animate-spin" />
            ) : isEditing ? (
              "Guardar cambios"
            ) : (
              "Registrar lote"
            )}
          </Button>
          <DrawerClose asChild>
            <Button outline disabled={isSubmitting}>
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PartBatchFormViewer;
