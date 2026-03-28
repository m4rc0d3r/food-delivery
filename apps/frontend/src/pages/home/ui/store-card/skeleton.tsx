import type { ComponentProps } from "react";

import { StoreCardTemplate } from "./template";

import { StarRatingScaleSkeleton } from "@/entities/store";
import type { Card } from "@/shared/ui/primitives";
import { Skeleton } from "@/shared/ui/primitives";

type Props = ComponentProps<typeof Card>;

function StoreCardSkeleton({ ...props }: Props) {
  return (
    <StoreCardTemplate
      store={{
        name: <Skeleton className="h-7 w-full" />,
        rating: (
          <div className="flex items-center gap-1">
            <StarRatingScaleSkeleton />
            <Skeleton className="h-5 w-4" />
          </div>
        ),
        image: <Skeleton className="size-full" />,
        createdAt: <Skeleton className="h-5 w-34" />,
      }}
      {...props}
    />
  );
}

export { StoreCardSkeleton };
