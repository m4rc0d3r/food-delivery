import * as z from "zod";

import * as Common from "./common";

const zOut = z.array(Common.zOut);
type Out = z.infer<typeof zOut>;

export { zOut };
export type { Out };
