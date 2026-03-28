import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { throwify } from "@workspace/core";

import type { Service } from "../service";

import { GET_ME, QUERY_KEYS } from "./common";

import type { GetQueryOptions, InferQueryGenerics } from "@/shared/tanstack-query";

type UseGetMeGenerics = InferQueryGenerics<
  Service[typeof GET_ME],
  (typeof QUERY_KEYS)[typeof GET_ME]["queryKey"]
>;
type UseGetMeOptions = GetQueryOptions<UseGetMeGenerics>;

function useGetMe(
  service: Service,
  options?: Omit<UseGetMeOptions, "queryKey" | "queryFn">,
  queryClient?: QueryClient,
) {
  return useQuery(
    {
      ...options,
      ...QUERY_KEYS[GET_ME],
      queryFn: async () => throwify(await service[GET_ME]()()),
    } as UseGetMeOptions,
    queryClient,
  );
}

export { useGetMe };
