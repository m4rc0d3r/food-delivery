import * as z from "zod";

const TRUE = "true";
const FALSE = "false";

const zBooleanishString = z.enum([TRUE, FALSE]).transform((value) => value === TRUE);

function zArrayable<T extends z.ZodSchema>(schema: T) {
  return z.union([schema, z.array(schema)]);
}

export { FALSE, TRUE, zArrayable, zBooleanishString };
