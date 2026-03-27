import type { Context } from "hono";

import type { ErrorCode } from "@/infra/error-code";

function conflict(c: Context, errorCode: ErrorCode) {
  c.status(409);
  return c.json({
    errorCode,
  });
}

export { conflict };
