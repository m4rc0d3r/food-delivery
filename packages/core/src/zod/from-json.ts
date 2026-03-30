import z from "zod";

import { transformJson } from "./transformers";

function zFromJson<T extends z.ZodSchema<unknown>>(schema: T) {
  return z.string().transform(transformJson(schema));
}

export { zFromJson };
