"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { forgotPasswordSchema, ForgotPasswordData } from "@/lib/form-schemas";

import SubmitButton from "../_components/submit-button";
import { onSendEmail, verifyCode } from "../actions";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSend = emailForm.handleSubmit(async ({ email }) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const res = await onSendEmail("password_recovery", { email });

      if (!res.status) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      setEmail(email);
      setStep("code");
    } catch (err) {
      console.error("Error al enviar código:", err);
      toast.error("No se pudo enviar el código. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  });

  const onVerify = async (codeToVerify: string) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const res = await verifyCode(codeToVerify, "password_recovery");

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      if (!res.token) {
        toast.error("Token no disponible.");
        return;
      }

      toast.success(res.message);
      router.push(`/auth/reset-password?token=${res.token}`);
    } catch (err) {
      console.error("Error al verificar código:", err);
      toast.error("No se pudo verificar el código.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCodeChange = (value: string) => {
    setCode(value);
    if (value.length === 6) {
      onVerify(value);
    }
  };

  const onResend = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const res = await onSendEmail("password_recovery", { email });

      if (!res.status) {
        toast.error(res.message);
        return;
      }

      toast.success("Código reenviado.");
    } catch (err) {
      console.error("Error al reenviar código:", err);
      toast.error("No se pudo reenviar el código.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
        <CardDescription>
          {step === "email"
            ? "Ingresa tu correo para recibir el código"
            : "Ingresa el código que te enviamos"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" ? (
          <Form {...emailForm}>
            <form onSubmit={onSend}>
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu correo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton
                type="submit"
                isSubmitting={isSubmitting}
                loadingText="Enviando..."
                className="mt-6 w-full"
              >
                Enviar código
              </SubmitButton>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={onCodeChange}
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot key={index} index={index} className="size-12" />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <p className="text-base-content/60 text-center text-sm">
              Enviado a: <span className="font-semibold">{email}</span>
            </p>
            <SubmitButton
              variant="neutral"
              isSubmitting={isSubmitting}
              loadingText="Reenviando..."
              onClick={onResend}
              className="w-full"
            >
              Reenviar código
            </SubmitButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
