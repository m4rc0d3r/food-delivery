import * as z from "zod";

function zArrayable<T extends z.ZodSchema>(schema: T) {
  return z.union([schema, z.array(schema)]);
}

export { zArrayable };
