import "./globals.css";

import { cookies } from "next/headers";

import Providers from "@/components/providers";
import { geistMono, geistSans } from "@/config/font.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - Maestranza Unidos S.A.",
    default: "Maestranza Unidos S.A.",
  },
  description:
    "Sistema de control de inventario para maestranzas industriales.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cookieStore] = await Promise.all([cookies()]);

  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";
  const isMobile = cookieStore.get("isMobile")?.value === "true";

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <Providers initialMobileState={isMobile} defaultOpen={!isCollapsed}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
