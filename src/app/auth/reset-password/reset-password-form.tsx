"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ButtonPassword } from "@/components/ui/button";
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
import { resetPasswordSchema, ResetPasswordData } from "@/lib/form-schemas";
import { cn } from "@/lib/utils";

import SubmitButton from "../_components/submit-button";
import { resetPassword } from "../actions";

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [showPwd, setShowPwd] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const pwd = form.watch("password");

  const requirements = [
    { label: "Al menos 8 caracteres", valid: pwd.length >= 8 },
    { label: "Al menos un número", valid: /[0-9]/.test(pwd) },
    { label: "Al menos una letra minúscula", valid: /[a-z]/.test(pwd) },
    { label: "Al menos una letra mayúscula", valid: /[A-Z]/.test(pwd) },
    {
      label: "Al menos un carácter especial (@#$%&*)",
      valid: /[^A-Za-z0-9]/.test(pwd),
    },
  ];

  const onSubmit = form.handleSubmit(async (data) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const res = await resetPassword(token, data.password);

      if (res.type === "success") {
        toast.success(res.message);
        router.push("/auth/login");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
      toast.error("No se pudo restablecer la contraseña. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Restablece tu contraseña</CardTitle>
        <CardDescription>Escribe tu nueva contraseña</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPwd ? "text" : "password"}
                        placeholder="Nueva contraseña"
                        {...field}
                      />
                      <ButtonPassword
                        isVisible={showPwd}
                        setIsVisible={() => setShowPwd((v) => !v)}
                      />
                    </div>
                  </FormControl>
                  <ul className="space-y-1 text-sm">
                    {requirements.map(({ label, valid }) => (
                      <li
                        key={label}
                        className={cn(
                          "text-error flex items-center gap-2",
                          valid && "text-green-400",
                        )}
                      >
                        {valid ? (
                          <IconCircleCheck className="size-4" />
                        ) : (
                          <IconCircleX className="size-4" />
                        )}
                        {label}
                      </li>
                    ))}
                  </ul>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConf ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        {...field}
                      />
                      <ButtonPassword
                        isVisible={showConf}
                        setIsVisible={() => setShowConf((v) => !v)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton
              type="submit"
              isSubmitting={isSubmitting}
              loadingText="Restableciendo contraseña..."
              className="mt-6 w-full"
            >
              Restablecer contraseña
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
