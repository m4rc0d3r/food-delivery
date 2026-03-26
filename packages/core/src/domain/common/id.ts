import * as z from "zod";

const zSchema = z.int();
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
