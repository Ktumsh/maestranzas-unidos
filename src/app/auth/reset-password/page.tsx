import { redirect } from "next/navigation";

import { auth } from "../auth";
import ResetPasswordForm from "./reset-password-form";

export default async function ResetPasswordPage() {
  const session = await auth();

  if (session?.user) redirect("/");

  return <ResetPasswordForm />;
}
