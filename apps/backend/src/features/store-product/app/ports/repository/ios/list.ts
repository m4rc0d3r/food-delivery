import { Domain, Pagination, Sorting } from "@workspace/core";
import * as z from "zod";

import * as Common from "./common";

const zIn = z.object({
  filter: z.object({
    storeId: Domain.StoreProduct.zSchema.shape.storeId,
    name: Domain.Product.zSchema.shape.name.optional(),
    categoryIds: z.array(Domain.Product.zSchema.shape.categoryId).optional(),
    price: z
      .object({
        minimum: Domain.StoreProduct.zSchema.shape.price.optional(),
        maximum: Domain.StoreProduct.zSchema.shape.price.optional(),
      })
      .optional(),
  }),
  sorting: Sorting.zOptions(["name", "price"]),
  pagination: Pagination.zOptions,
});
type In = z.infer<typeof zIn>;

const zOut = Pagination.createPageSchema(Common.zOut);
type Out = z.infer<typeof zOut>;

export { zIn, zOut };
export type { In, Out };
