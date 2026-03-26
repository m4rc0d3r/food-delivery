import * as z from "zod";

import { Id, LifeCycleDates } from "../common";

import { Code, Discount } from "./attributes";

const zSchema = z
  .object({
    id: Id.zSchema,
    name: z.string().trim(),
    code: Code.zSchema,
    discount: Discount,
    orderId: Id.zSchema.nullable(),
  })
  .extend(LifeCycleDates.zSchema.shape);
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
