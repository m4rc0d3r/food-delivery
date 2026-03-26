import * as z from "zod";

const zSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
