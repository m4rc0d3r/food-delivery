import type { Order } from "../../model";

import type { HonoClient } from "@/shared/hono";

function mapDtoToEntity({
  createdAt,
  ...rest
}: Extract<
  Awaited<ReturnType<Awaited<ReturnType<HonoClient["orders"]["list"]["$post"]>>["json"]>>,
  {
    page: unknown;
  }
>["page"][number]): Order {
  return {
    ...rest,
    createdAt: new Date(createdAt),
  };
}

export { mapDtoToEntity };
