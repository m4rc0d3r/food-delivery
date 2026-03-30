import { Domain } from "@workspace/core";
import type * as z from "zod";

import {
  zIn as zRepositoryCreateIn,
  zOut as zRepositoryCreateOut,
} from "@/features/order/app/ports/repository/ios/create";
import { zIn as zServiceCreateIn } from "@/features/user/app/service/ios/create";

const zIn = zRepositoryCreateIn
  .omit({
    userId: true,
  })
  .extend({
    user: zServiceCreateIn.omit({
      password: true,
    }),
  });
type In = z.infer<typeof zIn>;

const zOut = zRepositoryCreateOut.extend({
  userPassword: Domain.User.zSchema.shape.password,
});
type Out = z.infer<typeof zOut>;

export { zIn, zOut };
export type { In, Out };
