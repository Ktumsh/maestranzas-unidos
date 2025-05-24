"use client";

import { ThemeProvider } from "next-themes";

import { MobileProvider } from "@/providers/use-mobile-provider";

interface ProvidersProps {
  children: React.ReactNode;
  initialMobileState: boolean;
}

const Providers = ({ children, initialMobileState }: ProvidersProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
    >
      <MobileProvider initialMobileState={initialMobileState}>
        {children}
      </MobileProvider>
    </ThemeProvider>
  );
};

export default Providers;
