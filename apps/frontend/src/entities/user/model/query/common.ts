import { createQueryKeys } from "@lukemorales/query-key-factory";

const USER = "user";
const GET_ME = "getMe";

const QUERY_KEYS = createQueryKeys(USER, {
  [GET_ME]: null,
});

export { GET_ME, QUERY_KEYS };
