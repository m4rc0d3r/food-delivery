import type { Context } from "hono";

function badRequest<T>(c: Context, body: T) {
  c.status(400);
  return c.json(body);
}

export { badRequest };
