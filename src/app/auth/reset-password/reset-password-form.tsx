"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
  });

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
                  <FormMessage />
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
