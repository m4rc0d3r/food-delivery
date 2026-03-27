import type { Rec } from "@workspace/core";
import { Domain } from "@workspace/core";
import { DatabaseError } from "pg";

import { COUPON_CONSTRAINTS, USER_CONSTRAINTS } from "./schema";

const ERROR_CODE = {
  uniqueKeyViolation: "23505",
} as const;

type UniqueKeyViolationError = DatabaseError & {
  code: (typeof ERROR_CODE)["uniqueKeyViolation"];
  constraint: string;
};

function isUniqueKeyViolation(error: unknown): error is UniqueKeyViolationError {
  return (
    error instanceof DatabaseError &&
    error.code === ERROR_CODE.uniqueKeyViolation &&
    typeof error.constraint === "string"
  );
}

const CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT: Record<string, string> = {
  [USER_CONSTRAINTS.userEmail]: Domain.User.Constraint.UNIQUE_USER_EMAIL,
  [USER_CONSTRAINTS.userPhone]: Domain.User.Constraint.UNIQUE_USER_PHONE,
  [COUPON_CONSTRAINTS.couponCode]: Domain.Coupon.Constraint.UNIQUE_COUPON_CODE,
} satisfies Record<
  Rec.Values<typeof USER_CONSTRAINTS | typeof COUPON_CONSTRAINTS>,
  Domain.User.Constraint | Domain.Coupon.Constraint
>;

export { CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT, isUniqueKeyViolation };
export type { UniqueKeyViolationError };
