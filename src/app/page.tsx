import { redirect } from "next/navigation";

import { auth } from "./auth/auth";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return null;
}
