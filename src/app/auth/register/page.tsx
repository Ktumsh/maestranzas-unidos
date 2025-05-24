import { redirect } from "next/navigation";

import { auth } from "../auth";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/");
  }

  return <RegisterForm />;
}
