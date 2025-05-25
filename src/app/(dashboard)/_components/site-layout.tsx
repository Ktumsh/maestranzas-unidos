"use client";

import { SiteHeader } from "@/app/(dashboard)/_components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import AppSidebar from "./app-sidebar";

interface SiteLayoutProps {
  sidebarState: boolean;
  children: React.ReactNode;
}

const SiteLayout = ({ sidebarState, children }: SiteLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={sidebarState}>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SiteLayout;
