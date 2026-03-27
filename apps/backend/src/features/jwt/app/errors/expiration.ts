import type { OperationalErrorOptions } from "@workspace/core";
import { OperationalError } from "@workspace/core";

class ExpirationError extends OperationalError {
  readonly expiredAt: Date;

  constructor(expiredAt: Date, options?: OperationalErrorOptions) {
    super(options);
    this.expiredAt = expiredAt;
    this.message = `Token expired on ${this.expiredAt.toString()}`;
  }
}

export { ExpirationError };
