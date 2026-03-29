import type { UnexpectedError } from "@workspace/core";
import type { taskEither } from "fp-ts";

import type { List } from "./ios";

abstract class Provider {
  abstract list(params: List.In): taskEither.TaskEither<UnexpectedError, List.Out>;
}

export { Provider };
