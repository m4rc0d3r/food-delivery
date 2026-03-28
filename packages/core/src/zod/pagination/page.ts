import { z } from "zod";

import type { Meta } from "./meta";
import { createMeta, zMeta } from "./meta";
import type { Options } from "./options";

function createPageSchema<T extends z.ZodSchema>(item: T) {
  return z.object({
    data: z.array(item),
    meta: zMeta,
  });
}
type Page<T> = z.infer<ReturnType<typeof createPageSchema<z.ZodSchema<T>>>>;

function createPage<T>(options: Options, items: T[], numberOfItems: Meta["numberOfItems"]) {
  return {
    data: items,
    meta: createMeta(options, numberOfItems),
  } satisfies Page<T>;
}

export { createPage, createPageSchema };
export type { Page };
