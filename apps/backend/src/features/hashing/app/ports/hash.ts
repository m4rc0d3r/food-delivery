import type { UnexpectedError } from "@workspace/core";
import type { taskEither } from "fp-ts";

type HashData = (data: string) => taskEither.TaskEither<UnexpectedError, string>;

export type { HashData };
