import * as z from "zod";

import { Id, Image, LifeCycleDates, Price } from "../common";

const zSchema = z
  .object({
    id: Id.zSchema,
    name: z.string().trim(),
    price: Price.zSchema,
    categoryId: Id.zSchema,
    image: Image.zAsUrlSchema.nullable(),
  })
  .extend(LifeCycleDates.zSchema.shape);
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
