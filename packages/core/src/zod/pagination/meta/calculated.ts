import z from "zod";

import type { Options } from "../options";
import { getNumberOfPages, hasNextPage, hasPreviousPage } from "../utils";

import { createMinimalMeta, zMinimalMeta } from "./minimal";

const zCalculatedMeta = zMinimalMeta.extend({
  numberOfPages: z.number().int().nonnegative(),
  hasPrevious: z.boolean(),
  hasNext: z.boolean(),
});
type CalculatedMeta = z.infer<typeof zCalculatedMeta>;

function createCalculatedMeta(options: Options, numberOfItems: number): CalculatedMeta {
  const minimalMeta = createMinimalMeta(options, numberOfItems);

  return {
    ...minimalMeta,
    numberOfPages: getNumberOfPages(minimalMeta),
    hasPrevious: hasPreviousPage(minimalMeta),
    hasNext: hasNextPage(minimalMeta),
  };
}

export { createCalculatedMeta, zCalculatedMeta };
export type { CalculatedMeta };
