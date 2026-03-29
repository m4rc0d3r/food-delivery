import { zCategoryRepositoryIosListOut } from "backend";
import type * as z from "zod";

const zOut = zCategoryRepositoryIosListOut;
type Out = z.infer<typeof zOut>;

export { zOut };
export type { Out };
