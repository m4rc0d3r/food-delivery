import { z } from "zod";

const zDirection = z.enum(["ASC", "DESC"]);
const Direction = zDirection.enum;
type Direction = z.infer<typeof zDirection>;

function zOptions<const Fields extends readonly string[]>(fields: Fields) {
  return z.object({
    field: z.enum(fields),
    direction: zDirection,
  });
}
type Options<Fields extends readonly string[]> = z.infer<ReturnType<typeof zOptions<Fields>>>;

function defaultOptions<
  Schema extends ReturnType<typeof zOptions<readonly string[]>>,
  Field extends z.infer<Schema["shape"]["field"]>,
>(_schema: Schema, field: Field) {
  return {
    field,
    direction: Direction.ASC,
  } as const;
}

export { defaultOptions, Direction, zDirection, zOptions };
export type { Options };
