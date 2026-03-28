import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/ui/lib";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/primitives";

type Props = Omit<ComponentProps<typeof Card>, "children"> & {
  store: {
    name: ReactNode;
    rating: ReactNode;
    image: ReactNode;
    createdAt: ReactNode;
  };
};

function StoreCardTemplate({
  store: { name, rating, image, createdAt },
  className,
  ...props
}: Props) {
  return (
    <Card className={cn("transition-all hover:shadow-lg", className)} {...props}>
      <div className="relative aspect-video h-20 w-full object-cover">{image}</div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{rating}</CardDescription>
      </CardHeader>
      <CardContent>{createdAt}</CardContent>
    </Card>
  );
}

export { StoreCardTemplate };
