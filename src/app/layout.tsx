import "./globals.css";

import { cookies } from "next/headers";

import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { geistMono, geistSans } from "@/config/font.config";
import { metadataConfig } from "@/config/metadata.config";
import { cn } from "@/lib/utils";

import { getCurrentUser } from "./auth/actions";

export const metadata = metadataConfig;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userData, cookieStore] = await Promise.all([
    getCurrentUser(),
    cookies(),
  ]);

  const mobileState = cookieStore.get("isMobile")?.value === "true";

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <Providers userData={userData} mobileState={mobileState}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
