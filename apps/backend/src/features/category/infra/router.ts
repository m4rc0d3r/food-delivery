import { function as function_, taskEither } from "fp-ts";
import { Hono } from "hono";

import { Hono as Hono2 } from "@/infra";

const router = new Hono().get("/list", async (c) => {
  const { categoryService } = c.var;

  const searchResult = await function_.pipe(categoryService.list(), taskEither.toUnion)();

  if (searchResult instanceof Error) return Hono2.Response.Factory.internalServerError(c);

  return Hono2.Response.Factory.ok(c, {
    data: searchResult,
  });
});

export { router };
