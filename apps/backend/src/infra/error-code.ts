import { Enum } from "@workspace/core";

const ErrorCode = Enum.defineStr([
  "EMAIL_IS_IN_USE_BY_ANOTHER_USER",
  "PHONE_IS_IN_USE_BY_ANOTHER_USER",
  "COUPON_WITH_THIS_CODE_ALREADY_EXISTS",
  "USER_IS_NOT_AUTHENTICATED",
  "ENTITY_NOT_FOUND",
  "SOMETHING_WENT_WRONG",
]);
type ErrorCode = Enum.DefineStr<typeof ErrorCode>;

export { ErrorCode };
