import { Domain } from "@workspace/core";
import type * as z from "zod";

const zOut = Domain.StoreProduct.zSchema
  .pick({
    storeId: true,
    productId: true,
    price: true,
    stock: true,
    createdAt: true,
  })
  .extend(
    Domain.Product.zSchema.pick({
      name: true,
      image: true,
      categoryId: true,
    }).shape,
  );
type Out = z.infer<typeof zOut>;

export { zOut };
export type { Out };
