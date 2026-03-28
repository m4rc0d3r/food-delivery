import z from "zod";

import type { Options } from "../options";
import { zOptions } from "../options";

const zMinimalMeta = zOptions.extend({
  numberOfItems: z.number().int().nonnegative(),
});
type MinimalMeta = z.infer<typeof zMinimalMeta>;

function createMinimalMeta(options: Options, numberOfItems: number): MinimalMeta {
  return {
    ...options,
    numberOfItems,
  };
}

export { createMinimalMeta, zMinimalMeta };
export type { MinimalMeta };
