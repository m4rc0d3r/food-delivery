import type { Context } from "hono";

function created<T>(c: Context, body: T) {
  c.status(201);
  return c.json(body);
}

export { created };
