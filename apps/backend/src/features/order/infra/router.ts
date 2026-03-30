import { zValidator } from "@hono/zod-validator";
import { function as function_, taskEither } from "fp-ts";
import { Hono } from "hono";

import { OrderRepositoryIos } from "..";

import { Hono as Hono2 } from "@/infra";

const router = new Hono()
  .post("/create", zValidator("json", OrderRepositoryIos.Create.zIn), async (c) => {
    const { orderService } = c.var;
    const order = c.req.valid("json");

    const creationResult = await function_.pipe(orderService.create(order), taskEither.toUnion)();

    if (creationResult instanceof Error) return Hono2.Response.Factory.internalServerError(c);

    return Hono2.Response.Factory.ok(c, {
      order: creationResult,
    });
  })
  .post("/list", zValidator("json", OrderRepositoryIos.List.zIn), async (c) => {
    const { orderService } = c.var;
    const options = c.req.valid("json");

    const searchResult = await function_.pipe(orderService.list(options), taskEither.toUnion)();

    if (searchResult instanceof Error) return Hono2.Response.Factory.internalServerError(c);

    return Hono2.Response.Factory.ok(c, {
      page: searchResult,
    });
  });

export { router };
