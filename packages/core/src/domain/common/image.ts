import * as z from "zod";

const zAsUrlSchema = z.url();
type AsUrlSchema = z.infer<typeof zAsUrlSchema>;

export { zAsUrlSchema };
export type { AsUrlSchema };
