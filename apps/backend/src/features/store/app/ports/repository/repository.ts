import type { ImpossibleError, UnexpectedError } from "@workspace/core";
import type { taskEither } from "fp-ts";

import type { List } from "./ios";

abstract class Repository {
  abstract list(
    params: List.In,
  ): taskEither.TaskEither<UnexpectedError | ImpossibleError, List.Out>;
}

export { Repository };
