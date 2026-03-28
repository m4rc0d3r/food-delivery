import type { UnexpectedError } from "@workspace/core";
import type { taskEither } from "fp-ts";

import type { GetMe } from "./ios";

import type { AuthenticationError } from "@/shared/errors";

abstract class Provider {
  abstract getMe(): taskEither.TaskEither<UnexpectedError | AuthenticationError, GetMe.Out>;
}

export { Provider };
