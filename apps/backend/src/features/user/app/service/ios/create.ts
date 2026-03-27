import { Domain } from "@workspace/core";
import type * as z from "zod";

const zIn = Domain.User.zSchema.omit({
  id: true,
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
