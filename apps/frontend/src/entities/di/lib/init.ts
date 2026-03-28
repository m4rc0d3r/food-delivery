import { Http } from "@workspace/core";
import mitt from "mitt";

import type { DiContainer } from "../model";

import { AuthApiProvider, AuthService } from "@/entities/auth/@x/di";
import type { EventBusEvent } from "@/entities/event-bus/@x/di";
import { UserApiProvider, UserService } from "@/entities/user/@x/di";
import type { Config } from "@/shared/config";
import { createHonoClient } from "@/shared/hono";

type Params = {
  config: Config;
};

function initDiContainer({ config }: Params): DiContainer {
  const {
    backendApp: { protocol, address, port },
  } = config;

  const eventBus = mitt<EventBusEvent>();

  const client = createHonoClient(
    Http.createUrl({
      protocol,
      address,
      port,
    }),
    {
      fetch: async (input, requestInit, _Env, _executionCtx) => {
        const response = await fetch(input, {
          ...requestInit,
          credentials: "include",
        });

        if (response.status === 401) {
          eventBus.emit("userNotAuthenticated");
        }

        return response;
      },
    },
  );

  return {
    authService: new AuthService(new AuthApiProvider(client)),
    userService: new UserService(new UserApiProvider(client)),
    eventBus,
  };
}

export { initDiContainer };
