import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { Service } from "../service";

import { createMutationKeys } from "@/shared/tanstack-query";

const ORDER = "order";
const LIST = "list";
const CREATE_BY_AUTH = "createByAuth";
const CREATE_BY_UNAUTH = "createByUnauth";

const MUTATION_KEYS = createMutationKeys(ORDER, {
  CREATE_BY_AUTH,
  CREATE_BY_UNAUTH,
});

const QUERY_KEYS = createQueryKeys(ORDER, {
  [LIST]: (params: Parameters<Service[typeof LIST]>[0]) => [params],
});

export { CREATE_BY_AUTH, CREATE_BY_UNAUTH, LIST, MUTATION_KEYS, QUERY_KEYS };
