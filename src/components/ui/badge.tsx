import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("badge [&>svg]:size-3.5", {
  variants: {
    variant: {
      default: "",
      primary: "badge-primary",
      secondary: "badge-secondary",
      accent: "badge-accent",
      success: "badge-success",
      info: "badge-info",
      warning: "badge-warning",
      error: "badge-error",
      outline: "badge-outline",
      admin: "bg-admin/20! text-admin! border-0",
      compras: "bg-compras/20! text-compras! border-0",
      bodega: "bg-bodega/20! text-bodega! border-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Badge({
  className,
  variant,
  asChild = false,
  soft = true,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean; soft?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant }),
        soft && "badge-soft",
        className,
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
