import { zOrderRouterIosCreateByAuthIn, zStoreProductRepositoryIosCreateOut } from "backend";
import type * as z from "zod";

const zIn = zOrderRouterIosCreateByAuthIn;
type In = z.infer<typeof zIn>;

const zOut = zStoreProductRepositoryIosCreateOut;
type Out = z.infer<typeof zOut>;

export { zIn, zOut };
export type { In, Out };
