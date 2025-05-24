"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { MobileProvider } from "@/providers/use-mobile-provider";

import { SidebarProvider } from "./ui/sidebar";

interface ProvidersProps {
  children: React.ReactNode;
  initialMobileState: boolean;
  defaultOpen: boolean;
}

const Providers = ({
  children,
  initialMobileState,
  defaultOpen,
}: ProvidersProps) => {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        enableSystem={false}
      >
        <MobileProvider initialMobileState={initialMobileState}>
          <SidebarProvider defaultOpen={defaultOpen}>
            {children}
          </SidebarProvider>
        </MobileProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
