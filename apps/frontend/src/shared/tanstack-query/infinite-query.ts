import type { InfiniteData, QueryKey, UseInfiniteQueryOptions } from "@tanstack/react-query";
import type { Fn } from "@workspace/core";
import type { taskEither } from "fp-ts";

import type { InferQueryGenerics } from "./query";

type InferInfiniteQueryGenerics<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  QueryFn extends Fn<any[], taskEither.TaskEither<unknown, unknown>>,
  Key extends QueryKey,
> = Omit<InferQueryGenerics<QueryFn, Key>, "data"> & {
  data: InfiniteData<InferQueryGenerics<QueryFn, Key>["data"]>;
  pageParam: Parameters<QueryFn>[0];
};

type GetInfiniteQueryOptions<
  Generics extends InferInfiniteQueryGenerics<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Fn<any[], taskEither.TaskEither<unknown, unknown>>,
    QueryKey
  >,
> = UseInfiniteQueryOptions<
  Generics["fnData"],
  Generics["err"],
  Generics["data"],
  Generics["key"],
  Generics["pageParam"]
>;

export type { GetInfiniteQueryOptions, InferInfiniteQueryGenerics };
