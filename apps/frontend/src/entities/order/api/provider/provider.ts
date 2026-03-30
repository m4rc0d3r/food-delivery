import { Domain, UnexpectedError } from "@workspace/core";
import { ErrorCode } from "backend";
import { function as function_, taskEither } from "fp-ts";

import { OrderServicePorts } from "../../model";

import { mapDtoToEntity } from "./mappers";

import { UniqueKeyViolationError } from "@/shared/errors";
import type { HonoClient } from "@/shared/hono";

class ApiProvider extends OrderServicePorts.Provider {
  private readonly client: HonoClient;

  constructor(client: HonoClient) {
    super();
    this.client = client;
  }

  override createByAuth(
    params: OrderServicePorts.ProviderIos.CreateByAuth.In,
  ): taskEither.TaskEither<UnexpectedError, OrderServicePorts.ProviderIos.CreateByAuth.Out> {
    return function_.pipe(
      taskEither.tryCatch(
        async () =>
          (
            await this.client.orders["create-by-auth"].$post({
              json: params,
            })
          ).json(),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.flatMap((json) => {
        if ("errorCode" in json) {
          return taskEither.left(new UnexpectedError(json));
        }

        return taskEither.right(mapDtoToEntity(json.order));
      }),
    );
  }

  override createByUnauth(
    params: OrderServicePorts.ProviderIos.CreateByUnauth.In,
  ): taskEither.TaskEither<UnexpectedError, OrderServicePorts.ProviderIos.CreateByUnauth.Out> {
    return function_.pipe(
      taskEither.tryCatch(
        async () =>
          (
            await this.client.orders["create-by-unauth"].$post({
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

        const { userPassword } = json.order;
        return taskEither.right({
          ...mapDtoToEntity(json.order),
          userPassword,
        });
      }),
    );
  }

  override list(
    params: OrderServicePorts.ProviderIos.List.In,
  ): taskEither.TaskEither<UnexpectedError, OrderServicePorts.ProviderIos.List.Out> {
    return function_.pipe(
      taskEither.tryCatch(
        async () =>
          (
            await this.client.orders.list.$post({
              json: params,
            })
          ).json(),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.flatMap((json) => {
        if ("errorCode" in json) {
          return taskEither.left(new UnexpectedError(json));
        }

        const { page: data } = json;

        return taskEither.right(data.map(mapDtoToEntity));
      }),
    );
  }
}

export { ApiProvider };
