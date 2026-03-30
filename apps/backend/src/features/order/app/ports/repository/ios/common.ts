import { Domain } from "@workspace/core";
import type * as z from "zod";

const zOut = Domain.Order.zSchema
  .omit({
    updatedAt: true,
  })
  .extend(
    Domain.OrderItem.zSchema.pick({
      productId: true,
      price: true,
      quantity: true,
      createdAt: true,
    }).shape,
  );
type Out = z.infer<typeof zOut>;

export { zOut };
export type { Out };
