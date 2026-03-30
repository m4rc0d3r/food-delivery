import { zValidator } from "@hono/zod-validator";
import { Domain } from "@workspace/core";
import { function as function_, taskEither } from "fp-ts";
import { Hono } from "hono";

import { OrderRepositoryIos } from "../..";

import { CreateByAuth, CreateByUnauth } from "./ios";

import { UniqueKeyViolationError } from "@/app";
import { ErrorCode, Hono as Hono2 } from "@/infra";

const router = new Hono()
  .post("/list", zValidator("json", OrderRepositoryIos.List.zIn), async (c) => {
    const { orderService } = c.var;
    const options = c.req.valid("json");

    const searchResult = await function_.pipe(orderService.list(options), taskEither.toUnion)();

    if (searchResult instanceof Error) return Hono2.Response.Factory.internalServerError(c);

    return Hono2.Response.Factory.ok(c, {
      page: searchResult,
    });
  })
  .post("/create-by-unauth", zValidator("json", CreateByUnauth.zIn), async (c) => {
    const { generateUid, userService, orderService } = c.var;
    const { items, user } = c.req.valid("json");

    const creationResult = await function_.pipe(
      generateUid(12),
      taskEither.flatMap((password) =>
        userService.create({
          ...user,
          password,
        }),
      ),
      taskEither.flatMap(({ id }) =>
        function_.pipe(
          orderService.create({
            userId: id,
            items,
          }),
          taskEither.tapError(() =>
            taskEither.right(
              userService.delete({
                id,
              }),
            ),
          ),
        ),
      ),
      taskEither.toUnion,
    )();

    if (creationResult instanceof Error) {
      if (creationResult instanceof UniqueKeyViolationError) {
        switch (creationResult.constraintName) {
          case Domain.User.Constraint.UNIQUE_USER_EMAIL:
            return Hono2.Response.Factory.conflict(c, ErrorCode.EMAIL_IS_IN_USE_BY_ANOTHER_USER);
          case Domain.User.Constraint.UNIQUE_USER_PHONE:
            return Hono2.Response.Factory.conflict(c, ErrorCode.PHONE_IS_IN_USE_BY_ANOTHER_USER);
        }
      }

      return Hono2.Response.Factory.internalServerError(c);
    }

    return Hono2.Response.Factory.ok(c, {
      order: creationResult,
    });
  })
  .use(Hono2.Middleware.auth)
  .post("/create-by-auth", zValidator("json", CreateByAuth.zIn), async (c) => {
    const {
      orderService,
      user: { id },
    } = c.var;
    const order = c.req.valid("json");

    const creationResult = await function_.pipe(
      orderService.create({
        userId: id,
        ...order,
      }),
      taskEither.toUnion,
    )();

    if (creationResult instanceof Error) return Hono2.Response.Factory.internalServerError(c);

    return Hono2.Response.Factory.ok(c, {
      order: creationResult,
    });
  });

export { router };
