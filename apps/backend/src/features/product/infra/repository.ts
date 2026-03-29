import { ImpossibleError, Pagination, Sorting, Str, UnexpectedError } from "@workspace/core";
import type { InferSelectModel, SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { function as function_, taskEither } from "fp-ts";

import type { RepositoryIos } from "../app";
import { Repository } from "../app";
import type { Out } from "../app/ports/repository/ios/list";

import type { Db, products } from "@/infra";
import { escapeLikeArgument } from "@/infra";

const MESSAGE_ABOUT_INCORRECT_SELECTION_RESULT =
  "The row array returned from the database must contain 1 element because the query uses a row count aggregate function.";

class DrizzleRepository extends Repository {
  private readonly db: Db;

  constructor(db: Db) {
    super();
    this.db = db;
  }

  override list({
    filter: { name, price: { minimum, maximum } = {}, categoryIds } = {},
    sorting: { direction, field },
    pagination,
  }: RepositoryIos.List.In): taskEither.TaskEither<UnexpectedError | ImpossibleError, Out> {
    const finalSql = sql.empty();

    if (categoryIds) {
      finalSql.append(sql`
        WITH RECURSIVE
          category_tree AS (
            SELECT
              id
            FROM
              categories
            WHERE
              id IN (${categoryIds})
            UNION ALL
            SELECT
              c.id
            FROM
              categories c
              JOIN category_tree ct ON c.parent_id = ct.id
          )
      `);
    }

    finalSql.append(sql`
      SELECT
        p.id,
        p.name,
        p.price,
        p.image,
        p.category_id AS "categoryId",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        count(*) OVER () AS "totalCount"
      FROM
        products p
    `);

    const conditions: SQL[] = [];

    if (typeof name === "string") {
      conditions.push(sql` p.name ILIKE ${["%", escapeLikeArgument(name), "%"].join(Str.EMPTY)} `);
    }

    if (typeof minimum === "number") {
      conditions.push(sql` p.price >= ${minimum} `);
    }

    if (typeof maximum === "number") {
      conditions.push(sql` p.price <= ${maximum} `);
    }

    if (categoryIds) {
      conditions.push(sql`
        p.category_id IN (
          SELECT
            id
          FROM
            category_tree
        )
      `);
    }

    if (conditions.length > 0) {
      finalSql.append(sql` WHERE `);

      for (let i = 0; i < conditions.length; ++i) {
        finalSql.append(conditions[i]!);
        if (i < conditions.length - 1) {
          finalSql.append(sql` AND `);
        }
      }
    }

    finalSql.append(sql`
      ORDER BY
        p.${sql.identifier(field)} ${direction === Sorting.Direction.ASC ? sql`ASC` : sql`DESC`}
      LIMIT
        ${pagination.size}
      OFFSET
        ${Pagination.getNumberOfSkippedItems(pagination)};
    `);

    type Product = InferSelectModel<typeof products>;
    type DbProduct = Product & {
      totalCount: number;
    };

    return function_.pipe(
      taskEither.tryCatch(
        () => this.db.execute(finalSql),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.flatMap(({ rows, rowCount }) =>
        function_.pipe(
          Number((rows[0] as DbProduct)?.totalCount ?? rowCount),
          taskEither.fromPredicate(
            (numberOfItems) => !isNaN(numberOfItems),
            () => new ImpossibleError(MESSAGE_ABOUT_INCORRECT_SELECTION_RESULT),
          ),
          taskEither.map((numberOfItems) =>
            Pagination.createPage(pagination, rows as DbProduct[], numberOfItems),
          ),
        ),
      ),
    );
  }
}

export { DrizzleRepository };
