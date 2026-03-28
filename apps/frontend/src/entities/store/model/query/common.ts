import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { Service } from "../service";

const STORE = "store";
const LIST = "list";

const QUERY_KEYS = createQueryKeys(STORE, {
  [LIST]: (params: Parameters<Service[typeof LIST]>[0]) => [params],
});

export { LIST, QUERY_KEYS };
