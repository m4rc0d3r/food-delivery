import { z } from "zod";

const DEFAULT_OPTIONS = {
  number: 1,
  size: 10,
};

const zOptions = z.object({
  number: z.number().int().positive(),
  size: z.number().int().positive(),
});
type Options = z.infer<typeof zOptions>;

export { DEFAULT_OPTIONS, zOptions };
export type { Options };
