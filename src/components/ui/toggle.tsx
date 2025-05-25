"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "btn [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 text-nowrap data-[state=on]:bg-base-300 bg-neutral border-0",
  {
    variants: {
      variant: {
        default: "",
        neutral: "btn-neutral",
        primary: "btn-primary",
        secondary: "btn-secondary",
        accent: "btn-accent",
        info: "btn-info",
        success: "btn-success",
        warning: "btn-warning",
        error: "btn-error",
        ghost: "btn-ghost hover:bg-neutral",
        link: "btn-link no-underline",
      },
      size: {
        default: "",
        xs: "btn-xs",
        sm: "btn-sm",
        lg: "btn-lg",
        xl: "btn-xl text-lg",
        icon: "size-9 p-0",
        "icon-xs": "size-6 p-0",
        "icon-sm": "size-7 p-0",
        "icon-lg": "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  soft = false,
  wide = false,
  outline = false,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    soft?: boolean;
    wide?: boolean;
    outline?: boolean;
  }) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }), {
        "btn-soft": soft,
        "btn-wide max-w-full": wide,
        "btn-outline border-base-content/10": outline,
      })}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
