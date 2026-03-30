import { createMutationKeys } from "@/shared/tanstack-query";

const AUTH = "auth";
const REGISTER = "register";
const LOGIN = "login";
const LOGOUT = "logout";

const MUTATION_KEYS = createMutationKeys(AUTH, {
  REGISTER,
  LOGIN,
  LOGOUT,
});

export { LOGIN, LOGOUT, MUTATION_KEYS, REGISTER };
