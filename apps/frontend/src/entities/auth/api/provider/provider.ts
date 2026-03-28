import { Domain, TypeGuard, UnexpectedError } from "@workspace/core";
import { ErrorCode } from "backend";
import { function as function_, taskEither } from "fp-ts";

import { AuthServicePorts } from "../../model";

import { mapDtoToEntity } from "./mappers";

import { AuthenticationError, NotFoundError, UniqueKeyViolationError } from "@/shared/errors";
import type { HonoClient } from "@/shared/hono";

class ApiProvider extends AuthServicePorts.Provider {
  private readonly client: HonoClient;

  constructor(client: HonoClient) {
    super();
    this.client = client;
  }

  override register(
    params: AuthServicePorts.ProviderIos.Register.In,
  ): taskEither.TaskEither<
    UnexpectedError | UniqueKeyViolationError<Domain.User.Constraint>,
    AuthServicePorts.ProviderIos.Common.Out
  > {
    return function_.pipe(
      taskEither.tryCatch(
        async () =>
          (
            await this.client.auth.register.$post({
              json: params,
            })
          ).json(),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.flatMap((json) => {
        if ("errorCode" in json) {
          const { errorCode } = json;

          if (errorCode === ErrorCode.EMAIL_IS_IN_USE_BY_ANOTHER_USER)
            return taskEither.left(
              new UniqueKeyViolationError(Domain.User.Constraint.UNIQUE_USER_EMAIL),
            );
          if (errorCode === ErrorCode.PHONE_IS_IN_USE_BY_ANOTHER_USER)
            return taskEither.left(
              new UniqueKeyViolationError(Domain.User.Constraint.UNIQUE_USER_PHONE),
            );

          return taskEither.left(new UnexpectedError(json));
        }

        return taskEither.right(mapDtoToEntity(json));
      }),
    );
  }

  override login({
    ...params
  }: AuthServicePorts.ProviderIos.Login.In): taskEither.TaskEither<
    UnexpectedError | NotFoundError,
    AuthServicePorts.ProviderIos.Common.Out
  > {
    return function_.pipe(
      taskEither.tryCatch(
        async () =>
          (
            await this.client.auth.login.$post({
              json: params,
            })
          ).json(),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.flatMap((json) => {
        if ("errorCode" in json) {
          const { errorCode } = json;

          if (errorCode === ErrorCode.ENTITY_NOT_FOUND) return taskEither.left(new NotFoundError());

          return taskEither.left(new UnexpectedError(json));
        }

        return taskEither.right(mapDtoToEntity(json));
      }),
    );
  }

  override logout(): taskEither.TaskEither<UnexpectedError | AuthenticationError, void> {
    return function_.pipe(
      taskEither.tryCatch(
        async () => {
          const response = await this.client.auth.logout.$post();

          if (response.status === 204) return null;

          return response.json();
        },
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.flatMap((json) => {
        if (TypeGuard.isObject(json) && "errorCode" in json) {
          const { errorCode } = json;

          if (errorCode === ErrorCode.USER_IS_NOT_AUTHENTICATED)
            return taskEither.left(new AuthenticationError());

          return taskEither.left(new UnexpectedError(json));
        }

        return taskEither.right(void 0);
      }),
    );
  }
}

export { ApiProvider };
