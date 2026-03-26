import * as z from "zod";

import { Id, LifeCycleDates } from "../common";

const zSchema = z
  .object({
    id: Id.zSchema,
    name: z.string().trim(),
    parentId: Id.zSchema.nullable(),
  })
  .extend(LifeCycleDates.zSchema.shape);
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
