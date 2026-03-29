import { ImpossibleError, Pagination, Sorting, Str, UnexpectedError } from "@workspace/core";
import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import { function as function_, taskEither } from "fp-ts";

import type { RepositoryIos } from "../app";
import { Repository } from "../app";
import type { Out } from "../app/ports/repository/ios/list";

import type { Db } from "@/infra";
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
    filter: { storeId, name, price: { minimum, maximum } = {}, categoryIds },
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
        sp.store_id AS "storeId",
        sp.product_id AS "productId",
        sp.price,
        sp.stock,
        sp.created_at AS "createdAt",
        p.name,
        p.image,
        p.category_id AS "categoryId",
        count(*) OVER () AS "totalCount"
      FROM
        store_products sp
        INNER JOIN products p ON sp.product_id = p.id
    `);

    const conditions: SQL[] = [];

    if (typeof name === "string") {
      conditions.push(sql` p.name ILIKE ${["%", escapeLikeArgument(name), "%"].join(Str.EMPTY)} `);
    }

    if (typeof minimum === "number") {
      conditions.push(sql` sp.price >= ${minimum} `);
    }

    if (typeof maximum === "number") {
      conditions.push(sql` sp.price <= ${maximum} `);
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

    finalSql.append(sql`
      WHERE
        sp.store_id = ${storeId}
    `);

    if (conditions.length > 0) {
      for (const condition of conditions) {
        finalSql.append(sql` AND `);
        finalSql.append(condition);
      }
    }

    finalSql.append(sql`
      ORDER BY
        ${sql.identifier(field === "name" ? "p" : "sp")}.${sql.identifier(field)} ${direction ===
        Sorting.Direction.ASC
          ? sql`ASC`
          : sql`DESC`}
      LIMIT
        ${pagination.size}
      OFFSET
        ${Pagination.getNumberOfSkippedItems(pagination)};
    `);

    console.log(new PgDialect().sqlToQuery(finalSql).sql);

    type StoreProduct = Out["data"][number];
    type DbStoreProduct = StoreProduct & {
      totalCount: number;
    };

    return function_.pipe(
      taskEither.tryCatch(
        () => this.db.execute(finalSql),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.flatMap(({ rows, rowCount }) =>
        function_.pipe(
          Number((rows[0] as DbStoreProduct)?.totalCount ?? rowCount),
          taskEither.fromPredicate(
            (numberOfItems) => !isNaN(numberOfItems),
            () => new ImpossibleError(MESSAGE_ABOUT_INCORRECT_SELECTION_RESULT),
          ),
          taskEither.map((numberOfItems) =>
            Pagination.createPage(
              pagination,
              (rows as DbStoreProduct[]).map(({ totalCount, ...rest }) => rest),
              numberOfItems,
            ),
          ),
        ),
      ),
    );
  }
}

export { DrizzleRepository };
