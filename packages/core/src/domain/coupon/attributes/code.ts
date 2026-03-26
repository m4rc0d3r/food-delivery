import * as z from "zod";

const CONSTRAINTS = {
  length: 16,
};

const zSchema = z.string().trim().length(CONSTRAINTS.length);
type Schema = z.infer<typeof zSchema>;

export { CONSTRAINTS, zSchema };
export type { Schema };
