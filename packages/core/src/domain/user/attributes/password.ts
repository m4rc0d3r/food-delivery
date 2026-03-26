import * as z from "zod";

const CONSTRAINTS = {
  length: {
    minimum: 6,
    maximum: 32,
  },
};

const zSchema = z.string().trim().min(CONSTRAINTS.length.minimum).max(CONSTRAINTS.length.maximum);
type Schema = z.infer<typeof zSchema>;

export { CONSTRAINTS, zSchema };
export type { Schema };
