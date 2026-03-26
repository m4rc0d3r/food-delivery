import * as z from "zod";

import { Schema as TypeSchema } from "./type";

import { Percent } from ".";

const DISCRIMINATOR = "type";

const zSchema = z.discriminatedUnion(DISCRIMINATOR, [
  z.object({
    [DISCRIMINATOR]: z.literal(TypeSchema.FIXED),
    value: z.number().gt(0),
  }),
  z.object({
    [DISCRIMINATOR]: z.literal(TypeSchema.PERCENT),
    value: Percent.zSchema,
  }),
]);
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
