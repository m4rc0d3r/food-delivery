import * as z from "zod";

import { Id, Image, LifeCycleDates } from "../common";

import { Rating } from "./attributes";

const zSchema = z
  .object({
    id: Id.zSchema,
    name: z.string().trim(),
    rating: Rating.zSchema,
    image: Image.zAsUrlSchema.nullable(),
  })
  .extend(LifeCycleDates.zSchema.shape);
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
