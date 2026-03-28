import { zStoreRepositoryIosListIn, zStoreRepositoryIosListOut } from "backend";
import type * as z from "zod";

const zIn = zStoreRepositoryIosListIn;
type In = z.infer<typeof zIn>;

const zOut = zStoreRepositoryIosListOut;
type Out = z.infer<typeof zOut>;

export { zIn, zOut };
export type { In, Out };
