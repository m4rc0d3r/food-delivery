import type * as z from "zod";

import { zIn as zCreateIn } from "@/features/order/app/ports/repository/ios/create";

const zIn = zCreateIn.omit({
  userId: true,
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
