import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "input outline-base-content/50! selection:bg-primary selection:text-primary-content w-full",
        "aria-invalid:outline-error/50! aria-invalid:border-error",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
