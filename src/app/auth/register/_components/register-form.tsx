"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { getExistingEmail } from "@/db/querys/user-querys";
import { registerSchema, RegisterFormData } from "@/lib/form-schemas";
import { resultMessages } from "@/lib/result";

import RegisterInfoStep from "./register-email-step";
import RegisterPasswordStep from "./register-password-step";
import SubmitButton from "../../_components/submit-button";
import { signup } from "../../actions";

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { control, handleSubmit, trigger, watch } = form;

  const email = watch("email");

  const handleNext = async () => {
    const ok = await trigger(["firstName", "lastName", "email"]);
    if (!ok) return;
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const exists = await getExistingEmail(email);
      if (exists) {
        toast.error(resultMessages.EMAIL_ALREADY_EXISTS);
        return;
      }

      setStep(2);
    } catch (error) {
      console.error("Error al verificar correo:", error);
      toast.error(resultMessages.CHECK_EMAIL_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const result = await signup(data);

      if (result.type === "success") {
        toast.success(result.message);
        setTimeout(() => {
          window.location.href = result.redirectUrl || "/";
        }, 500);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error(resultMessages.SIGNUP_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepMessages: Record<number, string> = {
    1: "Ingresa tu nombre, apellido y correo electrónico",
    2: "Crea una contraseña segura para tu cuenta",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crea una cuenta</CardTitle>
        <CardDescription>{stepMessages[step]}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form>
            <div className="flex flex-col gap-6">
              {step === 1 && <RegisterInfoStep control={control} />}

              {step === 2 && (
                <RegisterPasswordStep control={control} watch={watch} />
              )}
            </div>
          </form>
        </Form>
        {step === 1 ? (
          <SubmitButton
            isSubmitting={isSubmitting}
            loadingText="Continuando..."
            onClick={handleNext}
            className="mt-6 w-full"
          >
            Continuar
          </SubmitButton>
        ) : (
          <div className="mt-6 flex gap-4">
            <Button
              disabled={isSubmitting}
              variant="secondary"
              onClick={() => setStep(1)}
            >
              Atrás
            </Button>
            <SubmitButton
              isSubmitting={isSubmitting}
              loadingText="Creando cuenta..."
              onClick={handleSubmit(onSubmit)}
            >
              Crear cuenta
            </SubmitButton>
          </div>
        )}
        <div className="mt-6 text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            Inicia sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
