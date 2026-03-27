import { UnexpectedError } from "@workspace/core";
import { taskEither } from "fp-ts";
import uid from "uid-safe";

import type { GenerateUid } from "../app";

const generateSafeUid: GenerateUid = (lengthInBytes) => {
  return taskEither.tryCatch(
    () => uid(lengthInBytes),
    (reason) => new UnexpectedError(reason),
  );
};

export { generateSafeUid };
