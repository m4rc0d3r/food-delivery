import { zUserServiceIosGetByCredentialsIn } from "backend";
import type { z } from "zod";

const zIn = zUserServiceIosGetByCredentialsIn;
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
