import type { Rec } from "@workspace/core";
import { z } from "zod";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createSelectors } from "@/shared/zustand";

const zAuthStatus = z.enum(["UNCERTAIN", "UNAUTHENTICATED", "AUTHENTICATED"]);
const AuthStatus = zAuthStatus.enum;
type AuthStatus = z.infer<typeof zAuthStatus>;

type State = {
  login: () => void;
  logout: () => void;
  reset: () => void;
} & {
  status: AuthStatus;
};

const initialState: Rec.WithoutMethods<State> = {
  status: AuthStatus.UNCERTAIN,
};

const STORE_NAME = "AuthStore";

const useAuthStore = createSelectors(
  create<State>()(
    devtools(
      (set) =>
        ({
          ...initialState,
          login: () =>
            set({
              status: AuthStatus.AUTHENTICATED,
            }),
          logout: () =>
            set({
              ...initialState,
              status: AuthStatus.UNAUTHENTICATED,
            }),
          reset: () => set(initialState),
        }) satisfies State,
      {
        store: STORE_NAME,
      },
    ),
  ),
);

export { AuthStatus, useAuthStore, zAuthStatus };
