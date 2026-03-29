import type { ImpossibleError } from "@workspace/core";
import { UnexpectedError } from "@workspace/core";
import { function as function_, taskEither } from "fp-ts";

import { Repository } from "../app";
import type { Out } from "../app/ports/repository/ios/list";

import type { Db } from "@/infra";
import { categories } from "@/infra";

class DrizzleRepository extends Repository {
  private readonly db: Db;

  constructor(db: Db) {
    super();
    this.db = db;
  }

  override list(): taskEither.TaskEither<UnexpectedError | ImpossibleError, Out> {
    return function_.pipe(
      taskEither.tryCatch(
        () => this.db.select().from(categories),
        (reason) => new UnexpectedError(reason),
      ),
    );
  }
}

export { DrizzleRepository };
