"use client";

import { IconCheck } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { THEMES } from "@/db/local/themes-data";
import { cn } from "@/lib/utils";

import ThemeBadge from "./theme-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { BetterTooltip } from "./ui/tooltip";

const ThemeController = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <Button variant="ghost" className="size-10 px-0">
        <div className="bg-base-100 group-hover:border-base-content/20 border-base-content/10 grid shrink-0 grid-cols-2 gap-0.5 rounded-md border p-1 transition-colors">
          <div className="bg-base-content size-1 rounded-full"></div>{" "}
          <div className="bg-primary size-1 rounded-full"></div>{" "}
          <div className="bg-secondary size-1 rounded-full"></div>{" "}
          <div className="bg-accent size-1 rounded-full"></div>
        </div>
      </Button>
    );

  return (
    <DropdownMenu>
      <BetterTooltip content="Personalizar tema" side="left">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" tabIndex={0} className="size-10 px-0">
            <div className="bg-base-100 group-hover:border-base-content/20 border-base-content/10 grid shrink-0 grid-cols-2 gap-0.5 rounded-md border p-1 transition-colors">
              <div className="bg-base-content size-1 rounded-full" />
              <div className="bg-primary size-1 rounded-full" />
              <div className="bg-secondary size-1 rounded-full" />
              <div className="bg-accent size-1 rounded-full" />
            </div>
          </Button>
        </DropdownMenuTrigger>
      </BetterTooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        {THEMES.map((t, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => setTheme(t.dataTheme)}
            className="group/item"
          >
            <ThemeBadge dataTheme={t.dataTheme} />
            {t.dataTheme === "night" ? (
              <div>
                <span className="text-xxs text-base-content/80 group-hover/item:text-neutral-content/80 block">
                  Predeterminado
                </span>
                <span className="block w-32 truncate leading-none">
                  {t.label}
                </span>
              </div>
            ) : (
              <span className="w-32 truncate">{t.label}</span>
            )}
            <IconCheck
              className={cn("invisible size-4 shrink-0", {
                visible: theme === t.dataTheme,
              })}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeController;
