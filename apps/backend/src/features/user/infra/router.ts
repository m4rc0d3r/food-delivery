import { function as function_, taskEither } from "fp-ts";
import { Hono } from "hono";

import { NotFoundError } from "@/app";
import { Hono as Hono2 } from "@/infra";

const router = new Hono().use(Hono2.Middleware.auth).get("/get-me", async (c) => {
  const {
    userService,
    user: { id },
  } = c.var;

  const searchResult = await function_.pipe(
    userService.getById({ id }),
    taskEither.map(({ passwordHash, updatedAt, ...me }) => me),
    taskEither.toUnion,
  )();

  if (searchResult instanceof Error) {
    if (searchResult instanceof NotFoundError) return Hono2.Response.Factory.notFound(c);

    return Hono2.Response.Factory.internalServerError(c);
  }

  return Hono2.Response.Factory.ok(c, {
    me: searchResult,
  });
});

export { router };
