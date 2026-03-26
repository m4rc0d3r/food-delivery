import * as z from "zod";

const CONSTRAINTS = {
  value: {
    minimum: 1,
  },
};

const zSchema = z.int().min(CONSTRAINTS.value.minimum);
type Schema = z.infer<typeof zSchema>;

export { CONSTRAINTS, zSchema };
export type { Schema };
