import type { QueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { throwify } from "@workspace/core";

import type { Service } from "../service";

import { LOGIN, MUTATION_KEYS } from "./common";

import type { GetMutationOptions, InferMutationGenerics } from "@/shared/tanstack-query";

type UseLoginGenerics = InferMutationGenerics<Service[typeof LOGIN]>;
type UseLoginOptions = GetMutationOptions<UseLoginGenerics>;

function useLogin(
  service: Service,
  options?: Omit<UseLoginOptions, "mutationKey" | "mutationFn">,
  queryClient?: QueryClient,
) {
  return useMutation(
    {
      ...options,
      mutationKey: MUTATION_KEYS[LOGIN],
      mutationFn: async (params) => {
        return throwify(await service.login(params)());
      },
    } as UseLoginOptions,
    queryClient,
  );
}

export { useLogin };
