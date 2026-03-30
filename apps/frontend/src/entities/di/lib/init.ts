import { Http } from "@workspace/core";
import mitt from "mitt";

import type { DiContainer } from "../model";

import { AuthApiProvider, AuthService } from "@/entities/auth/@x/di";
import { CategoryApiProvider, CategoryService } from "@/entities/category/@x/di";
import type { EventBusEvent } from "@/entities/event-bus/@x/di";
import { OrderApiProvider, OrderService } from "@/entities/order/@x/di";
import { StoreProductApiProvider, StoreProductService } from "@/entities/store-product/@x/di";
import { StoreApiProvider, StoreService } from "@/entities/store/@x/di";
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
    storeService: new StoreService(new StoreApiProvider(client)),
    storeProductService: new StoreProductService(new StoreProductApiProvider(client)),
    categoryService: new CategoryService(new CategoryApiProvider(client)),
    orderService: new OrderService(new OrderApiProvider(client)),
    eventBus,
  };
}

export { initDiContainer };
