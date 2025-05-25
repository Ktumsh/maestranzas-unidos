"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { MobileProvider } from "@/hooks/use-mobile";
import { UserProvider } from "@/hooks/use-user";

import type { User } from "@/db/schema";

interface ProvidersProps {
  children: React.ReactNode;
  userData: User | null;
  mobileState: boolean;
}

const Providers = ({ children, userData, mobileState }: ProvidersProps) => {
  return (
    <SessionProvider>
      <UserProvider initialUserData={userData}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="aqua"
          forcedTheme="aqua"
          enableSystem={false}
        >
          <MobileProvider initialMobileState={mobileState}>
            {children}
          </MobileProvider>
        </ThemeProvider>
      </UserProvider>
    </SessionProvider>
  );
};

export default Providers;
