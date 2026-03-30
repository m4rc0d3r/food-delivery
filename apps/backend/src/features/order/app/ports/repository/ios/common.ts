import { Domain } from "@workspace/core";
import * as z from "zod";

const zOut = Domain.Order.zSchema
  .omit({
    updatedAt: true,
  })
  .extend({
    items: z.array(
      Domain.OrderItem.zSchema.pick({
        productId: true,
        price: true,
        quantity: true,
      }),
    ),
  });
type Out = z.infer<typeof zOut>;

export { zOut };
export type { Out };
