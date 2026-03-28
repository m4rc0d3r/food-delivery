import type { Store } from "../../model";

import type { HonoClient } from "@/shared/hono";

function mapDtoToEntity({
  createdAt,
  ...rest
}: Extract<
  Awaited<ReturnType<Awaited<ReturnType<HonoClient["stores"]["list"]["$post"]>>["json"]>>,
  {
    page: unknown;
  }
>["page"]["data"][number]): Store {
  return {
    ...rest,
    createdAt: new Date(createdAt),
  };
}

export { mapDtoToEntity };
