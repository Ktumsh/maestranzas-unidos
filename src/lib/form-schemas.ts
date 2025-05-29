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
    .url({ message: formErrors.invalid.image })
    .or(z.literal("")),
});

export type PartFormData = z.infer<typeof createPartSchema>;

export const editPartSchema = createPartSchema.omit({ serialNumber: true });

export type EditPartFormData = z.infer<typeof editPartSchema>;

export const movementSchema = z.object({
  type: z.enum(["entrada", "salida"], {
    errorMap: () => ({ message: formErrors.required.type }),
  }),
  quantity: z
    .number({ invalid_type_error: formErrors.invalid.quantity })
    .int({ message: formErrors.invalid.quantity })
    .min(1, { message: formErrors.length.quantityMin }),
  reason: z
    .string()
    .min(1, { message: formErrors.required.reason })
    .max(200, { message: formErrors.length.reasonMax }),
  supplierId: z.string().uuid().optional(),
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
  paymentTerms: z
    .string()
    .min(3, { message: formErrors.required.paymentTerms }),
});

export type SupplierFormData = z.infer<typeof createSupplierSchema>;

export const purchaseOrderSchema = z.object({
  supplierId: z.string().uuid({ message: formErrors.invalid.supplier }),
  items: z
    .array(
      z.object({
        partId: z.string().min(1, {
          message: formErrors.required.part,
        }),
        quantity: z.number().int().min(1, {
          message: formErrors.length.quantityMin,
        }),
      }),
    )
    .min(1, { message: formErrors.required.item }),
  notes: z.string().optional(),
});

export type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;

export const partBatchSchema = z.object({
  partId: z.string().uuid(),
  batchCode: z.string().min(1, { message: formErrors.required.batchCode }),
  quantity: z.number().int().min(1, { message: formErrors.length.quantityMin }),
  expirationDate: z.date().optional(),
});

export type PartBatchFormData = z.infer<typeof partBatchSchema>;
