import type { zValidator } from "@hono/zod-validator";

import * as Response from "./response";

const zodValidatorHook: NonNullable<Parameters<typeof zValidator>[2]> = (result, c) => {
  if (!result.success)
    return Response.Factory.badRequest(c, {
      name: result.error.name,
      issues: result.error.issues,
    });

  return undefined;
};

export { zodValidatorHook };
