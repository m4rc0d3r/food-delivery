import type { OperationalErrorOptions } from "@workspace/core";
import { OperationalError } from "@workspace/core";

class AuthenticationError extends OperationalError {
  constructor(options?: OperationalErrorOptions) {
    super(options);
    this.message = "You are not authenticated.";
  }
}

export { AuthenticationError };
