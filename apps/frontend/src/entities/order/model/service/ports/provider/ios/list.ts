import { zOrderRepositoryIosListIn, zOrderRepositoryIosListOut } from "backend";
import type * as z from "zod";

const zIn = zOrderRepositoryIosListIn;
type In = z.infer<typeof zIn>;

const zOut = zOrderRepositoryIosListOut;
type Out = z.infer<typeof zOut>;

export { zIn, zOut };
export type { In, Out };
