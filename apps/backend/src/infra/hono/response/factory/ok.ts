import type { Context } from "hono";

function ok<T>(c: Context, body: T) {
  return c.json(body);
}

export { ok };
