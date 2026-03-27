import type { OperationalErrorOptions } from "@workspace/core";
import { OperationalError } from "@workspace/core";

type KeyType = "foreign" | "unique";

abstract class KeyViolationError<T extends KeyType> extends OperationalError {
  readonly type: T;
  readonly constraintName: string;

  constructor(type: T, constraintName: string, options?: OperationalErrorOptions) {
    super(options);
    this.type = type;
    this.constraintName = constraintName;
    this.message = `The ${this.type} key constraint named '${this.constraintName}' was violated.`;
  }
}

export { KeyViolationError };
export type { KeyType };
