import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import { either } from "fp-ts";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Entries } from "type-fest";

import { authRouter } from "./features/auth";
import { storeRouter } from "./features/store";
import { storeproductRouter } from "./features/store-product";
import { userRouter } from "./features/user";
import { createConfig, Hono as Hono2 } from "./infra";

expand(dotenvConfig());

const eitherConfig = createConfig(process.env);
if (either.isLeft(eitherConfig)) throw eitherConfig.left;

const config = eitherConfig.right;
const {
  cors: { origin, credentials },
} = config;

const app = new Hono()
  .use("*", async (c, next) => {
    for (const [key, value] of Object.entries(Hono2.Context.create(config)) as Entries<
      ReturnType<typeof Hono2.Context.create>
    >) {
      c.set(key, value);
    }

    await next();
  })
  .use(
    "*",
    cors({
      origin,
      credentials,
    }),
  )
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/auth", authRouter)
  .route("/users", userRouter)
  .route("/stores", storeRouter)
  .route("/store-products", storeproductRouter);

type App = typeof app;

export type { App };

export default app;
