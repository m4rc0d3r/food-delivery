import type { UnexpectedError } from "@workspace/core";
import type { taskEither } from "fp-ts";

type GenerateUid = (lengthInBytes: number) => taskEither.TaskEither<UnexpectedError, string>;

export type { GenerateUid };
