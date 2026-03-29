import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { throwify } from "@workspace/core";

import type { Service } from "../service";

import { LIST, QUERY_KEYS } from "./common";

import type { GetQueryOptions, InferQueryGenerics } from "@/shared/tanstack-query";

type UseListGenerics = InferQueryGenerics<
  Service[typeof LIST],
  ReturnType<(typeof QUERY_KEYS)[typeof LIST]>["queryKey"]
>;
type UseListOptions = GetQueryOptions<UseListGenerics>;

function useList(
  service: Service,
  storeId: Parameters<Service[typeof LIST]>[0]["filter"]["storeId"],
  params: Parameters<Service[typeof LIST]>[0],
  options?: Omit<UseListOptions, "queryKey" | "queryFn">,
  queryClient?: QueryClient,
) {
  return useQuery(
    {
      ...options,
      ...QUERY_KEYS[LIST](storeId, params),
      queryFn: async () => throwify(await service[LIST](params)()),
    } as UseListOptions,
    queryClient,
  );
}

export { useList };
