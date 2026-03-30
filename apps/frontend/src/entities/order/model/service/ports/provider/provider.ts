import type { Domain, UnexpectedError } from "@workspace/core";
import type { taskEither } from "fp-ts";

import type { CreateByAuth, CreateByUnauth, List } from "./ios";

import type { UniqueKeyViolationError } from "@/shared/errors";

abstract class Provider {
  abstract createByAuth(
    params: CreateByAuth.In,
  ): taskEither.TaskEither<UnexpectedError, CreateByAuth.Out>;
  abstract createByUnauth(
    params: CreateByUnauth.In,
  ): taskEither.TaskEither<
    UnexpectedError | UniqueKeyViolationError<Domain.User.Constraint>,
    CreateByUnauth.Out
  >;
  abstract list(params: List.In): taskEither.TaskEither<UnexpectedError, List.Out>;
}

export { Provider };
