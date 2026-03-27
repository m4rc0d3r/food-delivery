import type { Context } from "hono";

import { ErrorCode } from "@/infra/error-code";

function internalServerError(c: Context) {
  c.status(500);
  return c.json({
    errorCode: ErrorCode.SOMETHING_WENT_WRONG,
  });
}

export { internalServerError };
