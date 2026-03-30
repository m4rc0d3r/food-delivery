import type { QueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { throwify } from "@workspace/core";

import type { Service } from "../service";

import { CREATE_BY_UNAUTH, MUTATION_KEYS } from "./common";

import type { GetMutationOptions, InferMutationGenerics } from "@/shared/tanstack-query";

type UseCreateByUnauthGenerics = InferMutationGenerics<Service[typeof CREATE_BY_UNAUTH]>;
type UseCreateByUnauthOptions = GetMutationOptions<UseCreateByUnauthGenerics>;

function useCreateByUnauth(
  service: Service,
  options?: Omit<UseCreateByUnauthOptions, "mutationKey" | "mutationFn">,
  queryClient?: QueryClient,
) {
  return useMutation(
    {
      ...options,
      mutationKey: MUTATION_KEYS[CREATE_BY_UNAUTH],
      mutationFn: async (params) => {
        return throwify(await service[CREATE_BY_UNAUTH](params)());
      },
    } as UseCreateByUnauthOptions,
    queryClient,
  );
}

export { useCreateByUnauth };
