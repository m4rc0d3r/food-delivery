import { Domain } from "@workspace/core";
import z from "zod";

const zShoppingCart = z.array(
  Domain.StoreProduct.zSchema
    .pick({
      storeId: true,
      productId: true,
    })
    .extend(
      Domain.OrderItem.zSchema.pick({
        quantity: true,
      }).shape,
    ),
);
type ShoppingCart = z.infer<typeof zShoppingCart>;

export { zShoppingCart };
export type { ShoppingCart };
