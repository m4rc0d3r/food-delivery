import type { QueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { throwify } from "@workspace/core";

import type { Service } from "../service";

import { LOGOUT, MUTATION_KEYS } from "./common";

import type { GetMutationOptions, InferMutationGenerics } from "@/shared/tanstack-query";

type UseLogoutGenerics = InferMutationGenerics<Service[typeof LOGOUT]>;
type UseLogoutOptions = GetMutationOptions<UseLogoutGenerics>;

function useLogout(
  service: Service,
  options?: Omit<UseLogoutOptions, "mutationKey" | "mutationFn">,
  queryClient?: QueryClient,
) {
  return useMutation(
    {
      ...options,
      mutationKey: MUTATION_KEYS[LOGOUT],
      mutationFn: async () => {
        return throwify(await service.logout()());
      },
    } as UseLogoutOptions,
    queryClient,
  );
}

export { useLogout };
