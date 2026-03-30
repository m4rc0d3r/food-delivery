import * as z from "zod";

import { Id, LifeCycleDates } from "../common";

const zSchema = z
  .object({
    id: Id.zSchema,
    userId: Id.zSchema,
  })
  .extend(LifeCycleDates.zSchema.shape);
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
