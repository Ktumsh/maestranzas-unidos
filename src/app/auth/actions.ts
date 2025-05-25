"use server";

import { AuthError } from "next-auth";

import { createUser, getUserById } from "@/db/querys/user-querys";
import { resultMessages } from "@/lib/result";

import { auth, signIn } from "./auth";

import type { User } from "@/db/schema";
import type { LoginFormData, RegisterFormData } from "@/lib/form-schemas";

export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const user = await getUserById(userId);
  return user ?? null;
}

interface Result {
  type: "success" | "error";
  message: string;
  redirectUrl?: string;
}

export async function signup(data: RegisterFormData): Promise<Result> {
  const { email, password, firstName, lastName } = data;

  try {
    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
    });

    if (!user) {
      return {
        type: "error",
        message: resultMessages.UNKNOWN_ERROR,
      };
    }

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return {
      type: "success",
      message: resultMessages.USER_CREATED,
      redirectUrl: "/",
    };
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return {
        type: "error",
        message: resultMessages.INVALID_CREDENTIALS,
      };
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as any).message === "string"
    ) {
      const msg = (error as any).message;
      if (msg.includes("duplicate key") && msg.includes("users_email_key")) {
        return {
          type: "error",
          message: resultMessages.EMAIL_ALREADY_EXISTS,
        };
      }
    }

    return {
      type: "error",
      message: resultMessages.UNKNOWN_ERROR,
    };
  }
}

export async function login(data: LoginFormData): Promise<Result> {
  try {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      return {
        type: "error",
        message: resultMessages.INVALID_CREDENTIALS,
      };
    }

    return {
      type: "success",
      message: resultMessages.LOGIN_SUCCESS,
      redirectUrl: "/",
    };
  } catch (err) {
    console.error("Error en login:", err);
    return {
      type: "error",
      message: resultMessages.UNKNOWN_ERROR,
    };
  }
}
