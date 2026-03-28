import type { Rec, Sorting } from "@workspace/core";
import { Domain } from "@workspace/core";
import { asc, desc, DrizzleQueryError } from "drizzle-orm";
import { DatabaseError } from "pg";

import { COUPON_CONSTRAINTS, USER_CONSTRAINTS } from "./schema";

const ERROR_CODE = {
  uniqueKeyViolation: "23505",
} as const;

type UniqueKeyViolationError = DrizzleQueryError & {
  cause: DatabaseError & {
    code: (typeof ERROR_CODE)["uniqueKeyViolation"];
    constraint: string;
  };
};

function isUniqueKeyViolation(error: unknown): error is UniqueKeyViolationError {
  return (
    error instanceof DrizzleQueryError &&
    error.cause instanceof DatabaseError &&
    error.cause.code === ERROR_CODE.uniqueKeyViolation &&
    typeof error.cause.constraint === "string"
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

const SORTING_OPERATOR_BY_DIRECTION: Record<Sorting.Direction, typeof asc | typeof desc> = {
  ASC: asc,
  DESC: desc,
};

const SYMBOLS = ["%", "_", "\\"];

function escapeLikeArgument(value: string) {
  return SYMBOLS.reduce(
    (escapedValue, symbol) => escapedValue.replaceAll(symbol, `\\${symbol}`),
    value,
  );
}

export {
  CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT,
  escapeLikeArgument,
  isUniqueKeyViolation,
  SORTING_OPERATOR_BY_DIRECTION,
};
export type { UniqueKeyViolationError };
