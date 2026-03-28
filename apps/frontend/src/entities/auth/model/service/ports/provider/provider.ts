import type { Domain, UnexpectedError } from "@workspace/core";
import type { taskEither } from "fp-ts";

import type { Common, Login, Register } from "./ios";

import type { AuthenticationError, NotFoundError, UniqueKeyViolationError } from "@/shared/errors";

abstract class Provider {
  abstract register(
    params: Register.In,
  ): taskEither.TaskEither<
    UnexpectedError | UniqueKeyViolationError<Domain.User.Constraint>,
    Common.Out
  >;
  abstract login(
    params: Login.In,
  ): taskEither.TaskEither<UnexpectedError | NotFoundError, Common.Out>;
  abstract logout(): taskEither.TaskEither<UnexpectedError | AuthenticationError, void>;
}

export { Provider };
