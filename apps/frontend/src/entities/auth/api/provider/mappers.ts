import type { AuthServicePorts } from "../../model";

import type { HonoClient } from "@/shared/hono";

function mapDtoToEntity({
  me: { createdAt, ...rest },
}: Exclude<
  Awaited<ReturnType<Awaited<ReturnType<HonoClient["auth"]["register"]["$post"]>>["json"]>>,
  {
    errorCode: unknown;
  }
>): AuthServicePorts.ProviderIos.Common.Out {
  return {
    ...rest,
    createdAt: new Date(createdAt),
  };
}

export { mapDtoToEntity };
