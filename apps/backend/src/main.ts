import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono().use("*", cors()).get("/", (c) => {
  return c.text("Hello Hono!");
});

type App = typeof app;

export type { App };

export default app;
