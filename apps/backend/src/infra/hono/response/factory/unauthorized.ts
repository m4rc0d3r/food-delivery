import type { Context } from "hono";

import { ErrorCode } from "@/infra/error-code";

function unauthorized(c: Context) {
  c.status(401);
  return c.json({
    errorCode: ErrorCode.USER_IS_NOT_AUTHENTICATED,
  });
}

export { unauthorized };
