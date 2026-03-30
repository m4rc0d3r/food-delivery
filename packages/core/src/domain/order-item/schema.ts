import * as z from "zod";

import { Id, LifeCycleDates, PositiveQuantity, Price } from "../common";

const zSchema = z
  .object({
    orderId: Id.zSchema,
    productId: Id.zSchema,
    quantity: PositiveQuantity.zSchema,
    price: Price.zSchema,
  })
  .extend(LifeCycleDates.zSchema.shape);
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
