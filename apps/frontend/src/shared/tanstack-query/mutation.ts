import type { QueryKey, UseMutationOptions } from "@tanstack/react-query";
import type { Fn } from "@workspace/core";
import type { either, taskEither } from "fp-ts";
import type { Entries } from "type-fest";

type InferMutationGenerics<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MutationFn extends Fn<any[], taskEither.TaskEither<unknown, unknown>>,
  Ctx = unknown,
> = {
  data: Extract<Awaited<ReturnType<ReturnType<MutationFn>>>, either.Right<unknown>>["right"];
  err: Extract<Awaited<ReturnType<ReturnType<MutationFn>>>, either.Left<unknown>>["left"];
  vars: Parameters<MutationFn>[0];
  ctx: Ctx;
};

type GetMutationOptions<
  Generics extends InferMutationGenerics<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Fn<any[], taskEither.TaskEither<unknown, unknown>>,
    unknown
  >,
> = UseMutationOptions<Generics["data"], Generics["err"], Generics["vars"], Generics["ctx"]>;

function createMutationKeys<BaseKey extends string, const Mutations extends Record<string, string>>(
  baseKey: BaseKey,
  mutations: Mutations,
) {
  return Object.fromEntries(
    (Object.entries(mutations) as Entries<Mutations>).map(([key, value]) => [
      key,
      [baseKey, value],
    ]),
  ) as { [K in keyof Mutations as Mutations[K]]: [BaseKey, K] } satisfies Record<string, QueryKey>;
}

export { createMutationKeys };
export type { GetMutationOptions, InferMutationGenerics };
