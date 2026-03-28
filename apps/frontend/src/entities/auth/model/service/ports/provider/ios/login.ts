import { Domain } from "@workspace/core";
import { z } from "zod";

const zIn = Domain.User.zSchema
  .pick({
    password: true,
  })
  .extend({
    emailOrPhone: z.union([Domain.User.zSchema.shape.email, Domain.User.zSchema.shape.phone]),
  });
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
