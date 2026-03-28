import { ImpossibleError, Pagination, Str, UnexpectedError } from "@workspace/core";
import type { SQL } from "drizzle-orm";
import { and, gte, ilike, lte, sql } from "drizzle-orm";
import { function as function_, taskEither } from "fp-ts";

import type { RepositoryIos } from "../app";
import { Repository } from "../app";
import type { Out } from "../app/ports/repository/ios/list";

import type { Db } from "@/infra";
import { escapeLikeArgument, SORTING_OPERATOR_BY_DIRECTION, stores } from "@/infra";

const MESSAGE_ABOUT_INCORRECT_SELECTION_RESULT =
  "The row array returned from the database must contain 1 element because the query uses a row count aggregate function.";

class DrizzleRepository extends Repository {
  private readonly db: Db;

  constructor(db: Db) {
    super();
    this.db = db;
  }

  override list({
    filter: { name, rating: { minimum, maximum } = {} } = {},
    sorting: { direction, field },
    pagination,
  }: RepositoryIos.List.In): taskEither.TaskEither<UnexpectedError | ImpossibleError, Out> {
    const ratingConditions: SQL[] = [];

    if (typeof minimum === "number") {
      ratingConditions.push(gte(stores.rating, minimum));
    }

    if (typeof maximum === "number") {
      ratingConditions.push(lte(stores.rating, maximum));
    }

    const where = and(
      ...(typeof name === "string"
        ? [ilike(stores.name, ["%", escapeLikeArgument(name), "%"].join(Str.EMPTY))]
        : []),
      and(...ratingConditions),
    );

    return function_.pipe(
      taskEither.tryCatch(
        () =>
          Promise.all([
            this.db
              .select()
              .from(stores)
              .where(where)
              .orderBy(SORTING_OPERATOR_BY_DIRECTION[direction](stores[field]))
              .limit(pagination.size)
              .offset(Pagination.getNumberOfSkippedItems(pagination)),
            this.db
              .select({
                count: sql`count(*)`,
              })
              .from(stores)
              .where(where),
          ]),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.flatMap(([rows, [{ count } = {}]]) =>
        function_.pipe(
          Number(count),
          taskEither.fromPredicate(
            (numberOfItems) => !isNaN(numberOfItems),
            () => new ImpossibleError(MESSAGE_ABOUT_INCORRECT_SELECTION_RESULT),
          ),
          taskEither.map((numberOfItems) => Pagination.createPage(pagination, rows, numberOfItems)),
        ),
      ),
    );
  }
}

export { DrizzleRepository };
