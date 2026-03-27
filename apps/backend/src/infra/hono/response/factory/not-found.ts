import type { Context } from "hono";

import { ErrorCode } from "@/infra/error-code";

function notFound(c: Context) {
  c.status(404);
  return c.json({
    errorCode: ErrorCode.ENTITY_NOT_FOUND,
  });
}

export { notFound };
