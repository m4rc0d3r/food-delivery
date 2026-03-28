import type { HonoClient } from "@/shared/hono";

type Source = Extract<
  Awaited<ReturnType<Awaited<ReturnType<HonoClient["auth"]["register"]["$post"]>>["json"]>>,
  {
    me: unknown;
  }
>["me"];

type User = Omit<Source, "createdAt"> & {
  createdAt: Date;
};

export type { User };
