import type { Context } from "hono";

function noContent(c: Context) {
  c.status(204);
  return c.body(null);
}

export { noContent };
