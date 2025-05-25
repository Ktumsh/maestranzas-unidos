import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Eye, EyeOff } from "lucide-react";

const buttonVariants = cva(
  "btn [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
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

function Button({
  className,
  variant,
  size,
  asChild = false,
  soft = false,
  wide = false,
  outline = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    soft?: boolean;
    wide?: boolean;
    outline?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), {
        "btn-soft": soft,
        "btn-wide max-w-full": wide,
        "btn-outline border-base-content/10": outline,
      })}
      {...props}
    />
  );
}

type ButtonPasswordType = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

function ButtonPassword({ isVisible, setIsVisible }: ButtonPasswordType) {
  return (
    <button
      type="button"
      className="text-base-content/60 absolute top-0 right-0 z-10 inline-flex h-full items-center justify-center px-3"
      onClick={() => setIsVisible(!isVisible)}
    >
      {isVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      <span className="sr-only">
        {isVisible ? "Hide password" : "Show password"}
      </span>
    </button>
  );
}

export { Button, ButtonPassword, buttonVariants };
