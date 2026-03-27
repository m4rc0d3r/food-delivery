import type { UnexpectedError } from "@workspace/core";
import type { taskEither } from "fp-ts";

import type { ExpirationError, VerificationError } from "../errors";
import type { PayloadToSign, SignedPayload } from "../types";

type In = {
  secret: string;
  token: string;
};

type Out<T extends PayloadToSign> = taskEither.TaskEither<
  UnexpectedError | VerificationError | ExpirationError,
  SignedPayload<T>
>;

type Fn<T extends PayloadToSign = PayloadToSign> = (params: In) => Out<T>;

export type { Fn, In, Out };
