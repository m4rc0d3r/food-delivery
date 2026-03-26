import * as z from "zod";

const CONSTRAINTS = {
  value: {
    greaterThan: 0,
  },
};

const zSchema = z.number().gt(CONSTRAINTS.value.greaterThan);
type Schema = z.infer<typeof zSchema>;

export { CONSTRAINTS, zSchema };
export type { Schema };
