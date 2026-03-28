import type { AuthService } from "@/entities/auth/@x/di";
import type { EventBus } from "@/entities/event-bus/@x/di";
import type { UserService } from "@/entities/user/@x/di";
import { createContextWithDisplayName, createUseNullableContext } from "@/shared/react";

type DiContainer = {
  authService: AuthService;
  userService: UserService;
  eventBus: EventBus;
};

const DiContainerContext = createContextWithDisplayName<DiContainer | null>(
  null,
  "DiContainerContext",
);

const useDiContainer = createUseNullableContext(DiContainerContext);

export { DiContainerContext, useDiContainer };
export type { DiContainer };
