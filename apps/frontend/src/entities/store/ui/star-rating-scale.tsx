import { Domain, range } from "@workspace/core";
import { Star } from "lucide-react";
import type { ComponentProps } from "react";

import styles from "./star-rating-scale.module.css";

import { cn } from "@/shared/ui/lib";

type Rating = Domain.Store.Attribute.Rating.Schema;

type Props = ComponentProps<"div"> & {
  rating: Rating;
} & (
    | {
        isEditable?: false | undefined;
        onRatingChange?: undefined;
      }
    | {
        isEditable: true;
        onRatingChange?: ((value: Rating) => void) | undefined;
      }
  ) & {
    starProps?: ComponentProps<typeof Star> | undefined;
  };

function StarRatingScale({
  rating,
  isEditable,
  onRatingChange,
  className,
  starProps: { className: starClassName, ...starProps } = {},
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "flex w-fit flex-row-reverse",
        isEditable && [styles["rating"], "hover:*:fill-none"],
        className,
      )}
      {...props}
    >
      {range(Domain.Store.Attribute.Rating.CONSTRAINTS.value.maximum)
        .reverse()
        .map((value) => {
          const normalizedValue = value + 1;

          return (
            <Star
              key={normalizedValue}
              className={cn(
                "stroke-primary size-4",
                normalizedValue <= rating && "fill-primary",
                starClassName,
              )}
              onClick={() => onRatingChange?.(normalizedValue)}
              {...starProps}
            />
          );
        })}
    </div>
  );
}

export { StarRatingScale };
