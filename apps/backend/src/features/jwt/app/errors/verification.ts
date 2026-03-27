import type { OperationalErrorOptions } from "@workspace/core";
import { OperationalError } from "@workspace/core";
import * as z from "zod";

const zVerificationErrorReason = z.enum(["SYNTACTICALLY_INCORRECT", "CRYPTOGRAPHICALLY_INVALID"]);
type VerificationErrorReason = z.infer<typeof zVerificationErrorReason>;

class VerificationError extends OperationalError {
  readonly reason: VerificationErrorReason;

  constructor(reason: VerificationErrorReason, options?: OperationalErrorOptions) {
    super(options);
    this.reason = reason;
    switch (this.reason) {
      case "SYNTACTICALLY_INCORRECT":
        this.message = "Token does not match jwt format.";
        break;
      case "CRYPTOGRAPHICALLY_INVALID":
        this.message = "The token complies with the jwt format, but is cryptographically invalid.";
        break;
    }
  }
}

export { VerificationError, zVerificationErrorReason };
export type { VerificationErrorReason };
