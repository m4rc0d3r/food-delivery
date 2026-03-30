import { Domain } from "@workspace/core";
import type * as z from "zod";

const zIn = Domain.User.zSchema.pick({
  id: true,
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
