import { zValidator } from "@hono/zod-validator";
import { Domain, Time } from "@workspace/core";
import { either, function as function_, taskEither } from "fp-ts";
import type { Context } from "hono";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";

import type { AuthTokenPayload } from "./types";

import { NotFoundError, UniqueKeyViolationError } from "@/app";
import type { JwtSignedPayload } from "@/features/jwt";
import { UserServiceIos } from "@/features/user";
import { ErrorCode, Hono as Hono2 } from "@/infra";

const router = new Hono()
  .post(
    "/register",
    zValidator("json", UserServiceIos.Create.zIn, Hono2.zodValidatorHook),
    async (c) => {
      const {
        config: {
          auth: { tokenCookieName },
        },
        cookieOptions,
        userService,
        authTokenService,
      } = c.var;
      const user = c.req.valid("json");

      const resultOfCreation = await function_.pipe(
        userService.create(user),
        taskEither.flatMap((user) =>
          function_.pipe(
            authTokenService.generate({ userId: user.id }),
            taskEither.tapIO(
              ({ token: authToken, payload }) =>
                () =>
                  setAuthenticationCookie(
                    c,
                    { name: tokenCookieName, options: cookieOptions },
                    { encoded: authToken, payload },
                  ),
            ),
            taskEither.map(() => user),
            taskEither.map(({ passwordHash, updatedAt, ...me }) => me),
          ),
        ),
        taskEither.toUnion,
      )();

      if (resultOfCreation instanceof Error) {
        if (resultOfCreation instanceof UniqueKeyViolationError) {
          switch (resultOfCreation.constraintName) {
            case Domain.User.Constraint.UNIQUE_USER_EMAIL:
              return Hono2.Response.Factory.conflict(c, ErrorCode.EMAIL_IS_IN_USE_BY_ANOTHER_USER);
            case Domain.User.Constraint.UNIQUE_USER_PHONE:
              return Hono2.Response.Factory.conflict(c, ErrorCode.PHONE_IS_IN_USE_BY_ANOTHER_USER);
          }
        }

        return Hono2.Response.Factory.internalServerError(c);
      }

      return Hono2.Response.Factory.created(c, {
        me: resultOfCreation,
      });
    },
  )
  .post(
    "/login",
    zValidator("json", UserServiceIos.GetByCredentials.zIn, Hono2.zodValidatorHook),
    async (c) => {
      const {
        config: {
          auth: { tokenCookieName },
        },
        cookieOptions,
        userService,
        authTokenService,
      } = c.var;
      const user = c.req.valid("json");

      const searchResult = await function_.pipe(
        userService.getByCredentials(user),
        taskEither.flatMap((user) =>
          function_.pipe(
            authTokenService.generate({ userId: user.id }),
            taskEither.tapIO(
              ({ token: authToken, payload }) =>
                () =>
                  setAuthenticationCookie(
                    c,
                    { name: tokenCookieName, options: cookieOptions },
                    { encoded: authToken, payload },
                  ),
            ),
            taskEither.map(() => user),
            taskEither.map(({ passwordHash, updatedAt, ...me }) => me),
          ),
        ),
        taskEither.toUnion,
      )();

      if (searchResult instanceof Error) {
        if (searchResult instanceof NotFoundError) return Hono2.Response.Factory.notFound(c);

        return Hono2.Response.Factory.internalServerError(c);
      }

      return Hono2.Response.Factory.ok(c, {
        me: searchResult,
      });
    },
  )
  .post("/logout", async (c) => {
    const {
      config: {
        auth: { tokenCookieName },
      },
      authTokenService,
    } = c.var;

    return function_.pipe(
      either.right(getCookie(c, tokenCookieName)),
      either.flatMap((token) =>
        function_.pipe(
          token,
          either.fromPredicate(
            (token) => typeof token === "string",
            () => Hono2.Response.Factory.unauthorized(c),
          ),
        ),
      ),
      taskEither.fromEither,
      taskEither.flatMap((token) =>
        function_.pipe(
          authTokenService.verify(token),
          taskEither.tapIO(() => () => clearAuthenticationCookies(c, tokenCookieName)),
          taskEither.mapLeft(() => Hono2.Response.Factory.unauthorized(c)),
          taskEither.map(() => Hono2.Response.Factory.noContent(c)),
        ),
      ),
      taskEither.toUnion,
    )();
  });

function setAuthenticationCookie(
  c: Context,
  cookie: {
    name: string;
    options: CookieOptions;
  },
  token: {
    encoded: string;
    payload: JwtSignedPayload<AuthTokenPayload>;
  },
) {
  const { exp, iat } = token.payload;
  const maxAge = exp - iat;
  const expires = new Date(exp * Time.MILLISECONDS_PER_SECOND);

  setCookie(c, cookie.name, token.encoded, {
    ...cookie.options,
    expires,
    maxAge,
  });
}

function clearAuthenticationCookies(c: Context, cookieName: string) {
  deleteCookie(c, cookieName);
}

export { router };
