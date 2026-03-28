import type { OperationalErrorOptions } from "@workspace/core";
import { OperationalError } from "@workspace/core";

class NotFoundError extends OperationalError {
  constructor(options?: OperationalErrorOptions) {
    super(options);
    this.message = "Object not found.";
  }
}

export { NotFoundError };
