import type { OperationalErrorOptions } from "@workspace/core";

import type { KeyType } from "./base";
import { KeyViolationError } from "./base";

const KEY_TYPE = "unique";

class UniqueKeyViolationError<U extends string> extends KeyViolationError<typeof KEY_TYPE, U> {
  constructor(constraintName: U, options?: OperationalErrorOptions) {
    super(KEY_TYPE, constraintName, options);
  }
}

export { UniqueKeyViolationError };
export type { KeyType };
