import type { HonoClient } from "@/shared/hono";

type Source = Extract<
  Awaited<ReturnType<Awaited<ReturnType<HonoClient["orders"]["list"]["$post"]>>["json"]>>,
  {
    page: unknown;
  }
>["page"];

type Order = Omit<Source[number], "createdAt"> & {
  createdAt: Date;
};

export type { Order };
