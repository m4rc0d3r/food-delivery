import { zValidator } from "@hono/zod-validator";
import { function as function_, taskEither } from "fp-ts";
import { Hono } from "hono";

import { ProductRepositoryIos } from "..";

import { Hono as Hono2 } from "@/infra";

const router = new Hono().post(
  "/list",
  zValidator("json", ProductRepositoryIos.List.zIn),
  async (c) => {
    const { productService } = c.var;
    const options = c.req.valid("json");

    const searchResult = await function_.pipe(productService.list(options), taskEither.toUnion)();

    if (searchResult instanceof Error) return Hono2.Response.Factory.internalServerError(c);

    return Hono2.Response.Factory.ok(c, {
      page: searchResult,
    });
  },
);

export { router };
