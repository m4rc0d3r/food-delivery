import { zUserServiceIosCreateIn } from "backend";
import type { z } from "zod";

const zIn = zUserServiceIosCreateIn;
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
