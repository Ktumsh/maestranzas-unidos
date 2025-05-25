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
