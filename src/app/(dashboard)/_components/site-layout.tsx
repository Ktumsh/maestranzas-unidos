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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SiteLayout;
