import { Str } from "@workspace/core";
import { Minus, Plus, Trash } from "lucide-react";

import { ShoppingCartStore } from "@/entities/shopping-cart";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/primitives";

function ShoppingCartPage() {
  const shoppingCartItems = ShoppingCartStore.useStore.use.items();

  return (
    <div className="flex grow">
      <aside className="flex flex-col gap-4 px-2"></aside>
      <div className="grow">
        <ul className="flex flex-col gap-4">
          {shoppingCartItems.map(({ storeId, productId, quantity }) => (
            <li key={[storeId, productId].join(Str.EMPTY)}>
              <Card>
                <CardHeader>
                  <CardTitle>Store ID: {storeId}</CardTitle>
                  <CardDescription>Product ID: {productId}</CardDescription>
                  <CardAction>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        ShoppingCartStore.remove({
                          storeId,
                          productId,
                        })
                      }
                    >
                      <Trash />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">Price: {232.43}</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={quantity <= 1}
                    onClick={() =>
                      ShoppingCartStore.changeQuantity({
                        storeId,
                        productId,
                        quantity: (prev) => prev - 1,
                      })
                    }
                  >
                    <Minus />
                  </Button>
                  <p className="font-bold">Quantity: {quantity}</p>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      ShoppingCartStore.changeQuantity({
                        storeId,
                        productId,
                        quantity: (prev) => prev + 1,
                      })
                    }
                  >
                    <Plus />
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { ShoppingCartPage };
