import { UnexpectedError } from "@workspace/core";
import { function as function_, taskEither } from "fp-ts";

import { CategoryServicePorts } from "../../model";

import { mapDtoToEntity } from "./mappers";

import type { HonoClient } from "@/shared/hono";

class ApiProvider extends CategoryServicePorts.Provider {
  private readonly client: HonoClient;

  constructor(client: HonoClient) {
    super();
    this.client = client;
  }

  override list(): taskEither.TaskEither<
    UnexpectedError,
    CategoryServicePorts.ProviderIos.List.Out
  > {
    return function_.pipe(
      taskEither.tryCatch(
        async () => (await this.client.categories.list.$get()).json(),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.flatMap((json) => {
        if ("errorCode" in json) {
          return taskEither.left(new UnexpectedError(json));
        }

        const { data } = json;

        return taskEither.right(data.map(mapDtoToEntity));
      }),
    );
  }
}

export { ApiProvider };
