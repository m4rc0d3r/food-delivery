import { RotateCw } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "./lib";
import { Button } from "./primitives";

type Props = ComponentProps<"div"> & {
  message?: string | undefined;
  onTryAgain?: (() => void) | undefined;
};

function QueryError({ message, onTryAgain, className, ...props }: Props) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)} {...props}>
      <p className="text-center text-2xl">{message ?? "Failed to load data"}</p>
      <Button variant="outline" onClick={onTryAgain}>
        Try again
        <RotateCw />
      </Button>
    </div>
  );
}

export { QueryError };
