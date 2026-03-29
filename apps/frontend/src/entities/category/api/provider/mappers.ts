import type { Category } from "../../model";

import type { HonoClient } from "@/shared/hono";

function mapDtoToEntity({
  createdAt,
  ...rest
}: Extract<
  Awaited<ReturnType<Awaited<ReturnType<HonoClient["categories"]["list"]["$get"]>>["json"]>>,
  {
    data: unknown;
  }
>["data"][number]): Category {
  return {
    ...rest,
    createdAt: new Date(createdAt),
  };
}

export { mapDtoToEntity };
