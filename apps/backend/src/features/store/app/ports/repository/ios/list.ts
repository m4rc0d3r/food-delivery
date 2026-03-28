import { Domain, Pagination, Sorting } from "@workspace/core";
import * as z from "zod";

import * as Common from "./common";

const zIn = z.object({
  filter: z
    .object({
      name: Domain.Store.zSchema.shape.name.optional(),
      rating: z
        .object({
          minimum: Domain.Store.zSchema.shape.rating.optional(),
          maximum: Domain.Store.zSchema.shape.rating.optional(),
        })
        .optional(),
    })
    .optional(),
  sorting: Sorting.zOptions(["name", "rating"]),
  pagination: Pagination.zOptions,
});
type In = z.infer<typeof zIn>;

const zOut = Pagination.createPageSchema(Common.zOut);
type Out = z.infer<typeof zOut>;

export { zIn, zOut };
export type { In, Out };
