import { UnexpectedError } from "@workspace/core";
import { ErrorCode } from "backend";
import { function as function_, taskEither } from "fp-ts";

import { UserServicePorts } from "../../model";

import { mapDtoToEntity } from "./mappers";

import { AuthenticationError, NotFoundError } from "@/shared/errors";
import type { HonoClient } from "@/shared/hono";

class ApiProvider extends UserServicePorts.Provider {
  private readonly client: HonoClient;

  constructor(client: HonoClient) {
    super();
    this.client = client;
  }

  override getMe(): taskEither.TaskEither<
    UnexpectedError | AuthenticationError,
    UserServicePorts.ProviderIos.GetMe.Out
  > {
    return function_.pipe(
      taskEither.tryCatch(
        async () => (await this.client.users["get-me"].$get()).json(),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.flatMap((json) => {
        if ("errorCode" in json) {
          const { errorCode } = json;

          // @ts-expect-error errorCode may be ErrorCode.USER_IS_NOT_AUTHENTICATED
          if (errorCode === ErrorCode.USER_IS_NOT_AUTHENTICATED)
            return taskEither.left(new AuthenticationError());

          if (errorCode === ErrorCode.ENTITY_NOT_FOUND) return taskEither.left(new NotFoundError());

          return taskEither.left(new UnexpectedError(json));
        }

        return taskEither.right(mapDtoToEntity(json));
      }),
    );
  }
}

export { ApiProvider };
