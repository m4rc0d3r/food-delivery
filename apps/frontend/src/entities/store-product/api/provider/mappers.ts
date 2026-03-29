import type { StoreProduct } from "../../model";

import type { HonoClient } from "@/shared/hono";

function mapDtoToEntity({
  createdAt,
  ...rest
}: Extract<
  Awaited<ReturnType<Awaited<ReturnType<HonoClient["store-products"]["list"]["$post"]>>["json"]>>,
  {
    page: unknown;
  }
>["page"]["data"][number]): StoreProduct {
  return {
    ...rest,
    createdAt: new Date(createdAt),
  };
}

export { mapDtoToEntity };
