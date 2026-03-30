import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import { either, function as function_ } from "fp-ts";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import type { Entries } from "type-fest";

import { authRouter } from "./features/auth";
import { categoryRouter } from "./features/category";
import { orderRouter } from "./features/order";
import { storeRouter } from "./features/store";
import { storeproductRouter } from "./features/store-product";
import { userRouter } from "./features/user";
import { createConfig, Hono as Hono2 } from "./infra";

expand(dotenvConfig());

const app = new Hono()
  .use("*", async (c, next) => {
    const eitherConfig = function_.pipe(
      createConfig(process.env),
      either.orElse(() =>
        createConfig(env(c as Parameters<typeof env>[0]) as Parameters<typeof createConfig>[0]),
      ),
      either.orElse(() => createConfig(c.env as Parameters<typeof createConfig>[0])),
    );
    if (either.isLeft(eitherConfig)) throw eitherConfig.left;

    const config = eitherConfig.right;

    for (const [key, value] of Object.entries(Hono2.Context.create(config)) as Entries<
      ReturnType<typeof Hono2.Context.create>
    >) {
      c.set(key, value);
    }

    await next();
  })
  .use("*", async (c, next) => {
    const { origin, credentials } = c.var.config.cors;

    return await cors({
      origin,
      credentials,
    })(c as Parameters<ReturnType<typeof cors>>[0], next);
  })
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/auth", authRouter)
  .route("/users", userRouter)
  .route("/stores", storeRouter)
  .route("/store-products", storeproductRouter)
  .route("/categories", categoryRouter)
  .route("/orders", orderRouter);

type App = typeof app;

export type { App };

export default app;
