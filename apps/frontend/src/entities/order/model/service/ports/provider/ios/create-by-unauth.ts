import { zOrderRouterIosCreateByUnauthIn, zOrderRouterIosCreateByUnauthOut } from "backend";
import type * as z from "zod";

const zIn = zOrderRouterIosCreateByUnauthIn;
type In = z.infer<typeof zIn>;

const zOut = zOrderRouterIosCreateByUnauthOut;
type Out = z.infer<typeof zOut>;

export { zIn, zOut };
export type { In, Out };
