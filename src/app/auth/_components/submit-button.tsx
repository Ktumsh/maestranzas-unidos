import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  isSubmitting: boolean;
  loadingText: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const SubmitButton = ({
  isSubmitting,
  loadingText,
  children,
  onClick,
  className,
  ...props
}: SubmitButtonProps & React.ComponentProps<"button">) => {
  return (
    <Button
      disabled={isSubmitting}
      onClick={onClick}
      className={cn("flex-1", className)}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Loader className="animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
