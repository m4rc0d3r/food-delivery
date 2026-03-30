import type * as z from "zod";

import { OrderRepositoryIos } from "@/features/order";

const zIn = OrderRepositoryIos.Create.zIn.omit({
  userId: true,
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
