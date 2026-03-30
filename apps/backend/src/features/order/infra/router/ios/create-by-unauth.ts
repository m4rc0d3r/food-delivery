import type * as z from "zod";

import { OrderRepositoryIos } from "@/features/order";
import { UserServiceIos } from "@/features/user";

const zIn = OrderRepositoryIos.Create.zIn
  .omit({
    userId: true,
  })
  .extend({
    user: UserServiceIos.Create.zIn.omit({
      password: true,
    }),
  });
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
