import { Domain } from "@workspace/core";
import type * as z from "zod";

const zOut = Domain.Store.zSchema.omit({
  updatedAt: true,
});
type Out = z.infer<typeof zOut>;

export { zOut };
export type { Out };
