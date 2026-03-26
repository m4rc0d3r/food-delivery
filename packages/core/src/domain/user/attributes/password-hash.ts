import * as z from "zod";

const zSchema = z.string().trim().nonempty();
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
