import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { throwify } from "@workspace/core";

import type { Service } from "../service";

import { LIST, QUERY_KEYS } from "./common";

import type { GetQueryOptions, InferQueryGenerics } from "@/shared/tanstack-query";

type UseListGenerics = InferQueryGenerics<
  Service[typeof LIST],
  (typeof QUERY_KEYS)[typeof LIST]["queryKey"]
>;
type UseListOptions = GetQueryOptions<UseListGenerics>;

function useList(
  service: Service,
  options?: Omit<UseListOptions, "queryKey" | "queryFn">,
  queryClient?: QueryClient,
) {
  return useQuery(
    {
      ...options,
      ...QUERY_KEYS[LIST],
      queryFn: async () => throwify(await service[LIST]()()),
    } as UseListOptions,
    queryClient,
  );
}

export { useList };
