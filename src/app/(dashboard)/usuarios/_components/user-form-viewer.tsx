"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button, ButtonPassword } from "@/components/ui/button";
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  createUserSchema,
  editUserSchema,
  type UserFormData,
  type EditUserFormData,
} from "@/lib/form-schemas";

interface UserFormViewerProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Omit<UserFormData, "password">;
  onSubmit: (
    data: UserFormData | Omit<UserFormData, "password">,
  ) => void | Promise<void>;
  isSubmitting: boolean;
}

const UserFormViewer = ({
  mode,
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: UserFormViewerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const isEditing = mode === "edit";

  const form = useForm<UserFormData | EditUserFormData>({
    resolver: zodResolver(isEditing ? editUserSchema : createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "bodega",
      ...(isEditing ? {} : { password: "" }),
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
            {isEditing ? "Editar usuario" : "Nuevo usuario"}
          </DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? `Actualiza la información de ${initialData?.firstName} ${initialData?.lastName}.`
              : "Crea un nuevo usuario para el sistema."}
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            autoComplete="off"
            className="flex flex-col overflow-y-auto px-4 text-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="new-password"
                        placeholder="Nombre del usuario"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="new-password"
                        placeholder="Apellido del usuario"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="new-password"
                      placeholder="Correo electrónico del usuario"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="compras">Compras</SelectItem>
                      <SelectItem value="bodega">Bodega</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isVisible ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Contraseña del usuario"
                          {...field}
                        />
                        <ButtonPassword
                          isVisible={isVisible}
                          setIsVisible={setIsVisible}
                        />
                      </div>
                    </FormControl>
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
            ) : isEditing ? (
              "Guardar cambios"
            ) : (
              "Crear usuario"
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

export default UserFormViewer;
