import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";
import type { Fn } from "@workspace/core";
import type { either, taskEither } from "fp-ts";

type InferQueryGenerics<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  QueryFn extends Fn<any[], taskEither.TaskEither<unknown, unknown>>,
  Key extends QueryKey,
> = {
  fnData: Extract<Awaited<ReturnType<ReturnType<QueryFn>>>, either.Right<unknown>>["right"];
  err: Extract<Awaited<ReturnType<ReturnType<QueryFn>>>, either.Left<unknown>>["left"];
  data: Extract<Awaited<ReturnType<ReturnType<QueryFn>>>, either.Right<unknown>>["right"];
  key: Key;
};

type GetQueryOptions<
  Generics extends InferQueryGenerics<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Fn<any[], taskEither.TaskEither<unknown, unknown>>,
    QueryKey
  >,
> = UseQueryOptions<Generics["fnData"], Generics["err"], Generics["data"], Generics["key"]>;

export type { GetQueryOptions, InferQueryGenerics };
