import { Pagination } from "@workspace/core";
import * as z from "zod";

import * as Common from "./common";

const zIn = z.object({
  pagination: Pagination.zOptions,
});
type In = z.infer<typeof zIn>;

const zOut = Pagination.createPageSchema(Common.zOut);
type Out = z.infer<typeof zOut>;

export { zIn, zOut };
export type { In, Out };
