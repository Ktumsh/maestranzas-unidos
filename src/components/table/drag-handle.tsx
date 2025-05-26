import { IconGripVertical } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DragHandleProps {
  dragListeners?: any;
  dragAttributes?: any;
  className?: string;
}

const DragHandle = ({
  dragListeners,
  dragAttributes,
  className,
}: DragHandleProps) => {
  return (
    <Button
      {...dragAttributes}
      {...dragListeners}
      variant="ghost"
      size="icon"
      className={cn(
        "text-base-content/60 size-7 hover:bg-transparent",
        className,
      )}
    >
      <IconGripVertical className="text-base-content/60 size-3" />
      <span className="sr-only">Reordenar</span>
    </Button>
  );
};

export default DragHandle;
