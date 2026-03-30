import { either, function as function_, json } from "fp-ts";
import { z } from "zod";

function transformJson<T extends z.ZodSchema<unknown>>(schema: T) {
  return ((value, ctx) => {
    const checkResult = function_.pipe(
      value,
      json.parse,
      either.map((value) => schema.safeParse(value)),
    );
    if (either.isLeft(checkResult)) {
      ctx.addIssue({
        code: "custom",
        message: `Failed to parse value as JSON. Cause: ${String(checkResult.left)}`,
      });
      return z.NEVER;
    }
    if (checkResult.right.success) {
      return checkResult.right.data as z.infer<T>;
    } else {
      for (const issue of checkResult.right.error.issues) {
        ctx.addIssue(issue as Parameters<typeof ctx.addIssue>[0]);
      }
      return z.NEVER;
    }
  }) satisfies Parameters<z.ZodString["transform"]>[0];
}

export { transformJson };
