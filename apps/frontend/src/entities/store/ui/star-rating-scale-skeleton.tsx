import type { ComponentProps } from "react";

import { cn } from "@/shared/ui/lib";
import { Skeleton } from "@/shared/ui/primitives";

type Props = ComponentProps<typeof Skeleton>;

function StarRatingScaleSkeleton({ className, ...props }: Props) {
  return <Skeleton className={cn("h-4 w-20", className)} {...props} />;
}

export { StarRatingScaleSkeleton };
