"use client";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import SiteBreadcrumbs from "./site-breadcrumbs";
import useIsScrolled from "../_hooks/use-is-scrolled";

export function SiteHeader() {
  const isScrolled = useIsScrolled();

  return (
    <header
      className={cn(
        "bg-base-300 sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear md:h-16",
        isScrolled && "bg-base-300/80 backdrop-blur-lg backdrop-saturate-150",
      )}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <SiteBreadcrumbs />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell />
          </Button>
        </div>
      </div>
    </header>
  );
}
