import { ImpossibleError, UnexpectedError } from "@workspace/core";
import { eq, or } from "drizzle-orm";
import { array, function as function_, option, taskEither } from "fp-ts";

import type { RepositoryIos } from "../app";
import { Repository } from "../app";

import { NotFoundError, UniqueKeyViolationError } from "@/app";
import type { Db } from "@/infra";
import { CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT, isUniqueKeyViolation, users } from "@/infra";

const MESSAGE_ABOUT_INCORRECT_INSERTION_RESULT =
  "The array of rows returned from the database must contain 1 element since no errors occurred during the insert.";

class DrizzleRepository extends Repository {
  private readonly db: Db;

  constructor(db: Db) {
    super();
    this.db = db;
  }

  override create(
    params: RepositoryIos.Create.In,
  ): taskEither.TaskEither<
    UnexpectedError | ImpossibleError | UniqueKeyViolationError,
    RepositoryIos.Common.Out
  > {
    return function_.pipe(
      taskEither.tryCatch(
        () => this.db.insert(users).values(params).returning(),
        (reason) => {
          if (isUniqueKeyViolation(reason)) {
            const constraintName = CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT[reason.cause.constraint];
            if (!constraintName) return new UnexpectedError(reason);

            return new UniqueKeyViolationError(constraintName);
          }
          return new UnexpectedError(reason);
        },
      ),
      taskEither.map(([user]) => user),
      taskEither.flatMap(
        taskEither.fromPredicate(
          (user) => !!user,
          () => {
            return new ImpossibleError(MESSAGE_ABOUT_INCORRECT_INSERTION_RESULT);
          },
        ),
      ),
    );
  }

  override delete({
    id,
  }: RepositoryIos.Delete.In): taskEither.TaskEither<
    UnexpectedError | ImpossibleError | NotFoundError,
    void
  > {
    return function_.pipe(
      taskEither.tryCatch(
        () => this.db.delete(users).where(eq(users.id, id)),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.map(({ rowCount }) => rowCount),
      taskEither.flatMap(
        taskEither.fromPredicate(
          (rowCount) => !!rowCount && rowCount > 0,
          () => new NotFoundError(),
        ),
      ),
      taskEither.map(() => void 0),
    );
  }

  override getByContactDetails({
    emailOrPhone,
  }: RepositoryIos.GetByContactDetails.In): taskEither.TaskEither<
    UnexpectedError | NotFoundError,
    RepositoryIos.Common.Out
  > {
    return function_.pipe(
      taskEither.tryCatch(
        () =>
          this.db
            .select()
            .from(users)
            .where(or(eq(users.email, emailOrPhone), eq(users.phone, emailOrPhone))),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.chain((rows) =>
        function_.pipe(
          rows,
          array.head,
          option.map(taskEither.right),
          option.getOrElse(() => taskEither.left(new NotFoundError())),
        ),
      ),
    );
  }

  override getById({
    id,
  }: RepositoryIos.GetById.In): taskEither.TaskEither<
    UnexpectedError | NotFoundError,
    RepositoryIos.Common.Out
  > {
    return function_.pipe(
      taskEither.tryCatch(
        () => this.db.select().from(users).where(eq(users.id, id)),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.chain((rows) =>
        function_.pipe(
          rows,
          array.head,
          option.map(taskEither.right),
          option.getOrElse(() => taskEither.left(new NotFoundError())),
        ),
      ),
    );
  }
}

export { DrizzleRepository };
