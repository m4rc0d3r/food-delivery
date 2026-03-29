import type { HonoClient } from "@/shared/hono";

type Source = Extract<
  Awaited<ReturnType<Awaited<ReturnType<HonoClient["store-products"]["list"]["$post"]>>["json"]>>,
  {
    page: unknown;
  }
>["page"];

type StoreProduct = Omit<Source["data"][number], "createdAt"> & {
  createdAt: Date;
};

export type { StoreProduct };
