import type { ImpossibleError, UnexpectedError } from "@workspace/core";
import type { taskEither } from "fp-ts";

import type { Common, Create, Delete, GetByContactDetails, GetById } from "./ios";

import type { NotFoundError, UniqueKeyViolationError } from "@/app";

abstract class Repository {
  abstract create(
    params: Create.In,
  ): taskEither.TaskEither<UnexpectedError | ImpossibleError | UniqueKeyViolationError, Common.Out>;
  abstract delete(
    params: Delete.In,
  ): taskEither.TaskEither<UnexpectedError | ImpossibleError | NotFoundError, void>;
  abstract getByContactDetails(
    params: GetByContactDetails.In,
  ): taskEither.TaskEither<UnexpectedError | NotFoundError, Common.Out>;
  abstract getById(
    params: GetById.In,
  ): taskEither.TaskEither<UnexpectedError | NotFoundError, Common.Out>;
}

export { Repository };
