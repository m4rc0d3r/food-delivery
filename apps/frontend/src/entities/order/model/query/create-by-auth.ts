import type { QueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { throwify } from "@workspace/core";

import type { Service } from "../service";

import { CREATE_BY_AUTH, MUTATION_KEYS } from "./common";

import type { GetMutationOptions, InferMutationGenerics } from "@/shared/tanstack-query";

type UseCreateByAuthGenerics = InferMutationGenerics<Service[typeof CREATE_BY_AUTH]>;
type UseCreateByAuthOptions = GetMutationOptions<UseCreateByAuthGenerics>;

function useCreateByAuth(
  service: Service,
  options?: Omit<UseCreateByAuthOptions, "mutationKey" | "mutationFn">,
  queryClient?: QueryClient,
) {
  return useMutation(
    {
      ...options,
      mutationKey: MUTATION_KEYS[CREATE_BY_AUTH],
      mutationFn: async (params) => {
        return throwify(await service[CREATE_BY_AUTH](params)());
      },
    } as UseCreateByAuthOptions,
    queryClient,
  );
}

export { useCreateByAuth };
