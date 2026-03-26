import * as z from "zod";

const CONSTRAINTS = {
  value: {
    greaterThan: 0,
    maximum: 100,
  },
};

const zSchema = z.number().gt(CONSTRAINTS.value.greaterThan).max(CONSTRAINTS.value.maximum);
type Schema = z.infer<typeof zSchema>;

export { CONSTRAINTS, zSchema };
export type { Schema };
