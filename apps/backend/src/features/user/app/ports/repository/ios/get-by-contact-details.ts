import { Domain } from "@workspace/core";
import * as z from "zod";

const zIn = z.object({
  emailOrPhone: z.union([Domain.User.zSchema.shape.email, Domain.User.zSchema.shape.phone]),
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
