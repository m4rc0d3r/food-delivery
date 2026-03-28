import type { QueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { throwify } from "@workspace/core";

import type { Service } from "../service";

import { MUTATION_KEYS, REGISTER } from "./common";

import type { GetMutationOptions, InferMutationGenerics } from "@/shared/tanstack-query";

type UseRegisterGenerics = InferMutationGenerics<Service[typeof REGISTER]>;
type UseRegisterOptions = GetMutationOptions<UseRegisterGenerics>;

function useRegister(
  service: Service,
  options?: Omit<UseRegisterOptions, "mutationKey" | "mutationFn">,
  queryClient?: QueryClient,
) {
  return useMutation(
    {
      ...options,
      mutationKey: MUTATION_KEYS[REGISTER],
      mutationFn: async (params) => {
        return throwify(await service.register(params)());
      },
    } as UseRegisterOptions,
    queryClient,
  );
}

export { useRegister };
