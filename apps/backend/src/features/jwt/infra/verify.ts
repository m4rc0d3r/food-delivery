import { UnexpectedError } from "@workspace/core";
import type { either } from "fp-ts";
import { taskEither } from "fp-ts";
import jwt from "jsonwebtoken";

import type { VerifyToken } from "../app";
import { ExpirationError, VerificationError } from "../app";

import type { AuthTokenPayload } from "@/features/auth";

const REASONS_BY_MESSAGE: Record<string, VerificationError["reason"]> = {
  "invalid token": "SYNTACTICALLY_INCORRECT",
  "jwt malformed": "SYNTACTICALLY_INCORRECT",
  "jwt signature is required": "SYNTACTICALLY_INCORRECT",
  "invalid signature": "CRYPTOGRAPHICALLY_INVALID",
};

type DecodedPayload = Extract<
  Awaited<ReturnType<VerifyToken.Out<AuthTokenPayload>>>,
  either.Right<unknown>
>["right"];

const verifyJwt: VerifyToken.Fn<AuthTokenPayload> = ({ secret, token }) => {
  return taskEither.tryCatch(
    () =>
      new Promise<DecodedPayload>((resolve, reject) =>
        jwt.verify(token, secret, (error, decoded) =>
          error === null ? resolve(decoded as DecodedPayload) : reject(error),
        ),
      ),
    (reason) => {
      if (reason instanceof jwt.TokenExpiredError) {
        const { expiredAt } = reason;
        return new ExpirationError(expiredAt);
      } else if (reason instanceof jwt.JsonWebTokenError) {
        const jwtReason = REASONS_BY_MESSAGE[reason.message];
        if (!jwtReason) {
          return new UnexpectedError(reason);
        }
        return new VerificationError(jwtReason);
      }
      return new UnexpectedError(reason);
    },
  );
};

export { verifyJwt };
