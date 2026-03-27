import { UnexpectedError } from "@workspace/core";
import type { either } from "fp-ts";
import { function as function_, taskEither } from "fp-ts";
import jwt from "jsonwebtoken";

import type { GenerateToken } from "../app";

import type { AuthTokenPayload } from "@/features/auth";

const generateJwt: GenerateToken.Fn<AuthTokenPayload> = ({ secret, payload, lifetime }) => {
  const clonedPayload = globalThis.structuredClone(payload);
  return function_.pipe(
    taskEither.tryCatch(
      () =>
        new Promise<string>((resolve, reject) =>
          jwt.sign(
            clonedPayload,
            secret,
            {
              expiresIn: lifetime,
              mutatePayload: true,
            },
            (error, encoded) => (error === null ? resolve(encoded!) : reject(error)),
          ),
        ),
      (reason) => new UnexpectedError(reason),
    ),
    taskEither.map((token) => ({
      token,
      payload: clonedPayload as Extract<
        Awaited<ReturnType<GenerateToken.Out<AuthTokenPayload>>>,
        either.Right<unknown>
      >["right"]["payload"],
    })),
  );
};

export { generateJwt };
