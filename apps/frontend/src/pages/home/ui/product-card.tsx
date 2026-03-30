import { AlertTriangle, CalendarDays, Layers3, Package, Store, Tag } from "lucide-react";
import type { ComponentProps } from "react";

import type { StoreProduct } from "@/entities/store-product";
import { formatCurrency, formatDate } from "@/shared/i18n";
import { cn } from "@/shared/ui/lib";
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@/shared/ui/primitives";

type Props = ComponentProps<typeof Card> & {
  product: StoreProduct;
  onAddToCart?: (() => void) | undefined;
};

function ProductCard({
  product: { categoryId, createdAt, image, name, price, productId, stock, storeId },
  onAddToCart,
  className,
  ...props
}: Props) {
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <Card
      className={cn(
        "w-full max-w-sm overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg",
        className,
      )}
      {...props}
    >
      <div className="bg-muted relative aspect-video w-full overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={`Product image ${name}`}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center">
            <Package className="h-12 w-12 stroke-1" />
          </div>
        )}

        {isOutOfStock && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase"
          >
            Not available
          </Badge>
        )}
        {isLowStock && (
          <Badge
            variant="outline"
            className="absolute top-2 right-2 flex items-center gap-1 border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase hover:bg-amber-100"
          >
            <AlertTriangle className="h-3 w-3" /> Few
          </Badge>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="hover:text-primary line-clamp-2 cursor-pointer text-xl leading-tight font-bold">
            {name}
          </CardTitle>
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 text-xs font-normal whitespace-nowrap"
          >
            <Layers3 className="text-muted-foreground h-3.5 w-3.5" />
            {categoryId}
          </Badge>
          <CardAction>
            <Button onClick={onAddToCart}>Add to cart</Button>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-4 pt-2 pb-3">
        <div className="bg-muted/50 flex items-end justify-between gap-2 rounded-lg border p-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Price
            </span>
            <span className="text-primary text-2xl font-extrabold tabular-nums">
              {formatCurrency(price)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Remaining
            </span>
            <div
              className={cn(
                "flex items-center gap-1.5 font-semibold tabular-nums",
                isOutOfStock
                  ? "text-destructive"
                  : isLowStock
                    ? "text-amber-700"
                    : "text-foreground",
              )}
            >
              <Package className="h-4 w-4 stroke-[2.5]" />
              <span className="text-lg">{stock}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-sky-600" />
            <span>
              Store: <span className="text-foreground font-medium tabular-nums">#{storeId}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-emerald-600" />
            <span>
              Product:{" "}
              <span className="text-foreground font-medium tabular-nums">#{productId}</span>
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="text-muted-foreground bg-muted/20 flex items-center gap-1.5 border-t p-4 pt-0 text-xs">
        <CalendarDays className="h-3.5 w-3.5" />
        Added: {formatDate(createdAt)}
      </CardFooter>
    </Card>
  );
}

export { ProductCard };
