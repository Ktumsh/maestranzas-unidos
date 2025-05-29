"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader, IconMinus, IconNut, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

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
import {
  purchaseOrderSchema,
  type PurchaseOrderFormData,
} from "@/lib/form-schemas";

import type { Part, Supplier } from "@/db/schema";

interface PurchaseOrderFormViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PurchaseOrderFormData) => void | Promise<void>;
  isSubmitting: boolean;
  suppliers: Array<Supplier>;
  parts: Array<Part>;
}

const PurchaseOrderFormViewer = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  suppliers,
  parts,
}: PurchaseOrderFormViewerProps) => {
  const isMobile = useIsMobile();

  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      supplierId: "",
      items: [],
      notes: "",
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (open) {
      form.reset({
        supplierId: "",
        items: [{ partId: "", quantity: 1 }],
        notes: "",
      });
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
          <DrawerTitle>Nueva orden de compra</DrawerTitle>
          <DrawerDescription>
            Completa los detalles para registrar una nueva orden.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            className="flex flex-col overflow-y-auto px-4 py-2 text-sm"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger
                        disabled={suppliers.length === 0}
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecciona un proveedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-6 gap-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.partId`}
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>Pieza</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona una pieza" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {parts.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.image ? (
                                <Image
                                  src={p.image}
                                  alt="Imagen de la pieza"
                                  width={24}
                                  height={24}
                                  className="rounded-box size-6 object-cover"
                                />
                              ) : (
                                <div className="bg-base-300 rounded-box flex size-6 items-center justify-center">
                                  <span className="text-base-content/60 text-xs">
                                    <IconNut className="size-4" />
                                  </span>
                                </div>
                              )}
                              {p.serialNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="relative col-span-2">
                      <FormLabel>
                        Cantidad{" "}
                        {fields.length > 1 &&
                          (index > 0 ? (
                            <Button
                              type="button"
                              size="icon-xs"
                              outline
                              title="Quitar pieza"
                              className="absolute top-2.5 right-0 size-6"
                              onClick={() => remove(index)}
                            >
                              <IconMinus />
                            </Button>
                          ) : null)}
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              outline
              size="sm"
              onClick={() => append({ partId: "", quantity: 1 })}
              className="mt-2 self-end"
            >
              <IconPlus />
              Agregar pieza
            </Button>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Observaciones adicionales..."
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
            ) : (
              "Registrar orden"
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

export default PurchaseOrderFormViewer;
