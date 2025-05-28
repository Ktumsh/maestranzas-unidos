import { z } from "zod";

import { formErrors } from "./form-errors";

const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

export const registerSchema = z
  .object({
    email: z.string().email({
      message: formErrors.required.email,
    }),
    firstName: z
      .string()
      .min(1, {
        message: formErrors.required.name,
      })
      .max(50, { message: formErrors.length.nameMax })
      .regex(onlyLettersRegex, {
        message: formErrors.invalid.name,
      }),
    lastName: z
      .string()
      .min(1, {
        message: formErrors.required.lastName,
      })
      .max(50, { message: formErrors.length.lastNameMax })
      .regex(onlyLettersRegex, {
        message: formErrors.invalid.lastName,
      }),
    password: z
      .string()
      .min(8, { message: formErrors.length.passwordMin })
      .regex(/[A-Z]/, { message: formErrors.password.noUppercase })
      .regex(/[a-z]/, { message: formErrors.password.noLowercase })
      .regex(/[0-9]/, { message: formErrors.password.noNumber })
      .regex(/[^A-Za-z0-9]/, { message: formErrors.password.noSymbol }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: formErrors.confirmPassword.mismatch,
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const loginSchema = z.object({
  email: z.string().regex(emailRegex, { message: formErrors.invalid.email }),
  password: z.string().min(1, { message: formErrors.required.password }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: formErrors.required.email }),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: formErrors.length.passwordMin })
      .regex(/[^A-Za-z0-9]/, {
        message: formErrors.password.noSymbol,
      })
      .regex(/[0-9]/, { message: formErrors.password.noNumber })
      .regex(/[a-z]/, { message: formErrors.password.noLowercase })
      .regex(/[A-Z]/, { message: formErrors.password.noUppercase }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: formErrors.password.mismatch,
    path: ["confirmPassword"],
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: formErrors.required.name })
    .max(50, { message: formErrors.length.nameMax })
    .regex(onlyLettersRegex, { message: formErrors.invalid.name }),
  lastName: z
    .string()
    .min(1, { message: formErrors.required.lastName })
    .max(50, { message: formErrors.length.lastNameMax })
    .regex(onlyLettersRegex, { message: formErrors.invalid.lastName }),
  email: z.string().regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, {
    message: formErrors.invalid.email,
  }),
  role: z.enum(["admin", "compras", "bodega"], {
    errorMap: () => ({ message: formErrors.required.role }),
  }),
  password: z
    .string()
    .min(8, { message: formErrors.length.passwordMin })
    .regex(/[A-Z]/, { message: formErrors.password.noUppercase })
    .regex(/[a-z]/, { message: formErrors.password.noLowercase })
    .regex(/[0-9]/, { message: formErrors.password.noNumber })
    .regex(/[^A-Za-z0-9]/, { message: formErrors.password.noSymbol })
    .optional(),
});

export type UserFormData = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: formErrors.required.name })
    .max(50, { message: formErrors.length.nameMax })
    .regex(onlyLettersRegex, { message: formErrors.invalid.name }),
  lastName: z
    .string()
    .min(1, { message: formErrors.required.lastName })
    .max(50, { message: formErrors.length.lastNameMax })
    .regex(onlyLettersRegex, { message: formErrors.invalid.lastName }),
  email: z.string().regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, {
    message: formErrors.invalid.email,
  }),
  role: z.enum(["admin", "compras", "bodega"], {
    errorMap: () => ({ message: formErrors.required.role }),
  }),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

export const createPartSchema = z.object({
  serialNumber: z
    .string()
    .min(1, { message: formErrors.required.serialNumber })
    .max(30, { message: formErrors.length.serialNumberMax })
    .regex(/^[A-Za-z0-9-]+$/, { message: formErrors.invalid.serialNumber }),
  description: z
    .string()
    .min(1, { message: formErrors.required.description })
    .max(100, { message: formErrors.length.descriptionMax }),
  locationId: z.string().min(1, { message: formErrors.required.location }),
  minStock: z
    .number({ invalid_type_error: formErrors.required.minStock })
    .int({ message: formErrors.invalid.minStock })
    .min(0, { message: formErrors.length.minStockMin }),
  image: z
    .string()
    .url({ message: "Debe ser una URL válida" })
    .or(z.literal("")),
});

export type PartFormData = z.infer<typeof createPartSchema>;

export const editPartSchema = createPartSchema.omit({ serialNumber: true });

export type EditPartFormData = z.infer<typeof editPartSchema>;

export const movementSchema = z.object({
  type: z.enum(["entrada", "salida"], {
    errorMap: () => ({ message: "Selecciona un tipo de movimiento." }),
  }),
  quantity: z
    .number({ invalid_type_error: "Ingresa un número válido." })
    .int("Debe ser un número entero.")
    .min(1, { message: "La cantidad debe ser mayor a cero." }),
  reason: z
    .string()
    .min(1, { message: "Debes ingresar un motivo." })
    .max(200, { message: "Máximo 200 caracteres." }),
});

export type PartMovementFormData = z.infer<typeof movementSchema>;

export const createSupplierSchema = z.object({
  name: z
    .string()
    .min(1, { message: formErrors.required.name })
    .max(100, { message: formErrors.length.nameMax }),

  contactEmail: z.string().regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, {
    message: formErrors.invalid.email,
  }),
  contactPhone: z
    .string()
    .min(10, { message: formErrors.required.phone })
    .max(50, { message: formErrors.length.phoneMax })
    .regex(
      /^\+?[0-9]{1,4}?[-.●]?\(?[0-9]{1,3}?\)?[-.●]?[0-9]{1,4}[-.●]?[0-9]{1,4}[-.●]?[0-9]{1,9}$/,
      {
        message: formErrors.invalid.phone,
      },
    ),
});

export type SupplierFormData = z.infer<typeof createSupplierSchema>;
