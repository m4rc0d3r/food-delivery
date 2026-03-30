import { ImpossibleError, Pagination, UnexpectedError } from "@workspace/core";
import { eq, sql } from "drizzle-orm";
import { function as function_, taskEither } from "fp-ts";

import type { RepositoryIos } from "../app";
import { Repository } from "../app";
import type { Out } from "../app/ports/repository/ios/list";

import type { Db } from "@/infra";
import { orderItems, orders } from "@/infra";

const MESSAGE_ABOUT_INCORRECT_INSERTION_RESULT =
  "The array of rows returned from the database must contain 1 element since no errors occurred during the insert.";

const MESSAGE_ABOUT_INCORRECT_SELECTION_RESULT =
  "The row array returned from the database must contain 1 element because the query uses a row count aggregate function.";

class DrizzleRepository extends Repository {
  private readonly db: Db;

  constructor(db: Db) {
    super();
    this.db = db;
  }

  override create({
    userId,
    items,
  }: RepositoryIos.Create.In): taskEither.TaskEither<
    UnexpectedError | ImpossibleError,
    RepositoryIos.Create.Out
  > {
    return function_.pipe(
      taskEither.tryCatch(
        () =>
          this.db
            .insert(orders)
            .values({
              userId,
            })
            .returning(),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.map(([order]) => order),
      taskEither.flatMap(
        taskEither.fromPredicate(
          (order) => !!order,
          () => {
            return new ImpossibleError(MESSAGE_ABOUT_INCORRECT_INSERTION_RESULT);
          },
        ),
      ),
      taskEither.flatMap((order) =>
        function_.pipe(
          taskEither.tryCatch(
            () =>
              this.db
                .insert(orderItems)
                .values(
                  items.map(({ storeId, productId, quantity }) => ({
                    orderId: order.id,
                    price: sql`
                      SELECT
                        price
                      FROM
                        store_products
                      WHERE
                        store_id = ${storeId}
                        AND product_id = ${productId}
                    `,
                    productId,
                    quantity,
                  })),
                )
                .returning(),
            (reason) => new UnexpectedError(reason),
          ),
          taskEither.map((orderItems) =>
            orderItems.map(({ productId, price, quantity, createdAt }) => ({
              id: order.id,
              userId,
              productId,
              price,
              quantity,
              createdAt,
            })),
          ),
        ),
      ),
    );
  }

  override list({
    pagination,
  }: RepositoryIos.List.In): taskEither.TaskEither<UnexpectedError | ImpossibleError, Out> {
    return function_.pipe(
      taskEither.tryCatch(
        () =>
          Promise.all([
            this.db
              .select()
              .from(orders)
              .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
              .limit(pagination.size)
              .offset(Pagination.getNumberOfSkippedItems(pagination)),
            this.db
              .select({
                count: sql`count(*)`,
              })
              .from(orders)
              .innerJoin(orderItems, eq(orders.id, orderItems.orderId)),
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
          taskEither.map((numberOfItems) =>
            Pagination.createPage(
              pagination,
              rows.map(
                ({
                  orders: { id, userId },
                  order_items: { productId, price, quantity, createdAt },
                }) => ({
                  id,
                  userId,
                  productId,
                  price,
                  quantity,
                  createdAt,
                }),
              ),
              numberOfItems,
            ),
          ),
        ),
      ),
    );
  }
}

export { DrizzleRepository };
