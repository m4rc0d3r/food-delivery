import { UnexpectedError } from "@workspace/core";
import { function as function_, taskEither } from "fp-ts";

import { StoreProductServicePorts } from "../../model";

import { mapDtoToEntity } from "./mappers";

import type { HonoClient } from "@/shared/hono";

class ApiProvider extends StoreProductServicePorts.Provider {
  private readonly client: HonoClient;

  constructor(client: HonoClient) {
    super();
    this.client = client;
  }

  override list(
    params: StoreProductServicePorts.ProviderIos.List.In,
  ): taskEither.TaskEither<UnexpectedError, StoreProductServicePorts.ProviderIos.List.Out> {
    return function_.pipe(
      taskEither.tryCatch(
        async () =>
          (
            await this.client["store-products"].list.$post({
              json: params,
            })
          ).json(),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.flatMap((json) => {
        if ("errorCode" in json) {
          return taskEither.left(new UnexpectedError(json));
        }

        const {
          page: { data, meta },
        } = json;

        return taskEither.right({
          data: data.map(mapDtoToEntity),
          meta,
        });
      }),
    );
  }
}

export { ApiProvider };
