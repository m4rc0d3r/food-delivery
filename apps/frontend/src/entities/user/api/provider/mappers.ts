import type { UserServicePorts } from "../../model";

import type { HonoClient } from "@/shared/hono";

function mapDtoToEntity({
  me: { createdAt, ...rest },
}: Exclude<
  Awaited<ReturnType<Awaited<ReturnType<HonoClient["auth"]["register"]["$post"]>>["json"]>>,
  {
    errorCode: unknown;
  }
>): UserServicePorts.ProviderIos.GetMe.Out {
  return {
    ...rest,
    createdAt: new Date(createdAt),
  };
}

export { mapDtoToEntity };
