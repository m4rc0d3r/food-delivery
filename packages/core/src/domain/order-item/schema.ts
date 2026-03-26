import * as z from "zod";

import { Id, LifeCycleDates, Price, Quantity } from "../common";

const zSchema = z
  .object({
    id: Id.zSchema,
    orderId: Id.zSchema,
    productId: Id.zSchema,
    quantity: Quantity.zSchema,
    price: Price.zSchema,
  })
  .extend(LifeCycleDates.zSchema.shape);
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
