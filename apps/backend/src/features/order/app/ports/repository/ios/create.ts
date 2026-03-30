import { Domain } from "@workspace/core";
import * as z from "zod";

import * as Common from "./common";

const zIn = z.object({
  userId: Domain.User.zSchema.shape.id,
  items: z.array(
    Domain.StoreProduct.zSchema
      .pick({
        storeId: true,
        productId: true,
      })
      .extend({
        quantity: Domain.Common.PositiveQuantity.zSchema,
      }),
  ),
});
type In = z.infer<typeof zIn>;

const zOut = z.array(Common.zOut);
type Out = z.infer<typeof zOut>;

export { zIn, zOut };
export type { In, Out };
