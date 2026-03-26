import * as z from "zod";

const CONSTRAINTS = {
  value: {
    minimum: 1,
    maximum: 5,
  },
};

const zSchema = z.number().min(CONSTRAINTS.value.minimum).max(CONSTRAINTS.value.maximum);
type Schema = z.infer<typeof zSchema>;

export { CONSTRAINTS, zSchema };
export type { Schema };
