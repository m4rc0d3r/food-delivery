import { ImageOff } from "lucide-react";
import type { ComponentProps } from "react";

import { StoreCardTemplate } from "./template";

import type { Store } from "@/entities/store";
import { StarRatingScale } from "@/entities/store";
import { formatDate } from "@/shared/i18n";
import type { Card } from "@/shared/ui/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/primitives";

type Props = ComponentProps<typeof Card> & {
  store: Store;
};

function StoreCard({ store: { name, rating, image, createdAt }, ...props }: Props) {
  return (
    <StoreCardTemplate
      store={{
        name: <h3 className="text-xl font-semibold tracking-tight">{name}</h3>,
        rating: (
          <div className="flex items-center gap-1">
            <StarRatingScale rating={rating} />
            <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
          </div>
        ),
        image: (
          <Avatar className="size-full rounded-none transition-transform after:rounded-none">
            <AvatarImage src={image ?? undefined} className="rounded-none object-cover" />
            <AvatarFallback className="rounded-none">
              <ImageOff />
            </AvatarFallback>
          </Avatar>
        ),
        createdAt: <p className="text-sm text-gray-600">Joined {formatDate(createdAt)}</p>,
      }}
      {...props}
    />
  );
}

export { StoreCard };
