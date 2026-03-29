import type { HonoClient } from "@/shared/hono";

type Source = Extract<
  Awaited<ReturnType<Awaited<ReturnType<HonoClient["categories"]["list"]["$get"]>>["json"]>>,
  {
    data: unknown;
  }
>["data"];

type Category = Omit<Source[number], "createdAt"> & {
  createdAt: Date;
};

export type { Category };
