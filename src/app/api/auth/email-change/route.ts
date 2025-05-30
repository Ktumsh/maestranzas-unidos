import fs from "fs";
import path from "path";

import * as brevo from "@getbrevo/brevo";
import { NextRequest, NextResponse } from "next/server";

import { getUserByEmail } from "@/db/querys/user-querys";

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string,
);

const smtpEmail = new brevo.SendSmtpEmail();

export async function POST(req: NextRequest) {
  try {
    const { currentEmail, newEmail, code, token } = await req.json();

    if (!currentEmail || !newEmail || !code || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 },
      );
    }

    const user = await getUserByEmail(currentEmail);

    const username = user.firstName + " " + user.lastName;

    const templatePath = path.join(
      process.cwd(),
      "src/app/auth/_lib/email-change.html",
    );
    let htmlContent = fs.readFileSync(templatePath, "utf8");

    htmlContent = htmlContent
      .replace("{{username}}", username)
      .replace("{{changeCode}}", code)
      .replace(
        "{{logoUrl}}",
        `https://maestranzas-unidos.vercel.app/logo/maestranza-logo.webp`,
      );

    smtpEmail.subject = "Cambio de dirección de correo electrónico";
    smtpEmail.sender = {
      name: "Maestranzas Unidos S.A.",
      email: process.env.EMAIL_FROM,
    };
    smtpEmail.to = [{ email: newEmail, name: username }];
    smtpEmail.htmlContent = htmlContent;

    await apiInstance.sendTransacEmail(smtpEmail);

    return NextResponse.json({ success: "Email sent" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
