import type { Domain } from "@workspace/core";
import { either, function as function_, taskEither } from "fp-ts";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { ErrorCode, Hono as Hono2 } from "@/infra";

const auth = createMiddleware<{
  Variables: {
    user: Pick<Domain.User.Schema, "id">;
  };
}>(async (c, next) => {
  const {
    config: {
      auth: { tokenCookieName },
    },
    authTokenService,
  } = c.var;

  const authenticationResult = await function_.pipe(
    either.right(getCookie(c, tokenCookieName)),
    either.flatMap((token) =>
      function_.pipe(
        token,
        either.fromPredicate(
          (token) => typeof token === "string",
          () => ErrorCode.USER_IS_NOT_AUTHENTICATED,
        ),
      ),
    ),
    taskEither.fromEither,
    taskEither.flatMap((token) =>
      function_.pipe(
        authTokenService.verify(token),
        taskEither.mapLeft(() => ErrorCode.USER_IS_NOT_AUTHENTICATED),
        taskEither.map(({ userId }) => ({
          id: userId,
        })),
      ),
    ),
    taskEither.toUnion,
  )();

  if (authenticationResult === ErrorCode.USER_IS_NOT_AUTHENTICATED)
    return Hono2.Response.Factory.unauthorized(c);

  c.set("user", authenticationResult);

  return await next();
});

export { auth };
