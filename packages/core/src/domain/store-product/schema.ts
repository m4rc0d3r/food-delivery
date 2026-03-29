import * as z from "zod";

import { Id, LifeCycleDates, Price, Quantity } from "../common";

const zSchema = z
  .object({
    storeId: Id.zSchema,
    productId: Id.zSchema,
    price: Price.zSchema,
    stock: Quantity.zSchema,
  })
  .extend(LifeCycleDates.zSchema.shape);
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
