import type { ImpossibleError, UnexpectedError } from "@workspace/core";
import type { taskEither } from "fp-ts";

import type { Create, List } from "./ios";

abstract class Repository {
  abstract create(
    params: Create.In,
  ): taskEither.TaskEither<UnexpectedError | ImpossibleError, Create.Out>;
  abstract list(
    params: List.In,
  ): taskEither.TaskEither<UnexpectedError | ImpossibleError, List.Out>;
}

export { Repository };
