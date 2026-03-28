import type { HonoClient } from "@/shared/hono";

type Source = Extract<
  Awaited<ReturnType<Awaited<ReturnType<HonoClient["stores"]["list"]["$post"]>>["json"]>>,
  {
    page: unknown;
  }
>["page"];

type Store = Omit<Source["data"][number], "createdAt"> & {
  createdAt: Date;
};

export type { Store };
