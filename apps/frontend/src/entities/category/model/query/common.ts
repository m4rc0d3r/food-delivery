import { createQueryKeys } from "@lukemorales/query-key-factory";

const CATEGORY = "category";
const LIST = "list";

const QUERY_KEYS = createQueryKeys(CATEGORY, {
  [LIST]: null,
});

export { LIST, QUERY_KEYS };
