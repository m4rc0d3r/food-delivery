import { zStoreProductRepositoryIosListIn, zStoreProductRepositoryIosListOut } from "backend";
import type * as z from "zod";

const zIn = zStoreProductRepositoryIosListIn;
type In = z.infer<typeof zIn>;

const zOut = zStoreProductRepositoryIosListOut;
type Out = z.infer<typeof zOut>;

export { zIn, zOut };
export type { In, Out };
