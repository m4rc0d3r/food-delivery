import { ImpossibleError, UnexpectedError } from "@workspace/core";
import { eq, sql } from "drizzle-orm";
import { function as function_, taskEither } from "fp-ts";

import type { RepositoryIos } from "../app";
import { Repository } from "../app";
import type { Out } from "../app/ports/repository/ios/list";

import type { Db } from "@/infra";
import { orderItems, orders } from "@/infra";

const MESSAGE_ABOUT_INCORRECT_INSERTION_RESULT =
  "The array of rows returned from the database must contain 1 element since no errors occurred during the insert.";

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
                      (
                        SELECT
                          price
                        FROM
                          store_products
                        WHERE
                          store_id = ${storeId}
                          AND product_id = ${productId}
                      )
                    `,
                    productId,
                    quantity,
                  })),
                )
                .returning(),
            (reason) => new UnexpectedError(reason),
          ),
          taskEither.tapError((e) => taskEither.right(console.log(e.cause))),
          taskEither.map((orderItems) => ({
            id: order.id,
            userId,
            createdAt: order.createdAt,
            items: orderItems.map(({ productId, price, quantity }) => ({
              productId,
              price,
              quantity,
            })),
          })),
        ),
      ),
    );
  }

  override list(
    _params: RepositoryIos.List.In,
  ): taskEither.TaskEither<UnexpectedError | ImpossibleError, Out> {
    return function_.pipe(
      taskEither.tryCatch(
        () =>
          this.db.select().from(orders).innerJoin(orderItems, eq(orders.id, orderItems.orderId)),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.map((rows) =>
        Object.values(
          rows.reduce(
            (prev, cur) => {
              const order = prev[cur.orders.id];
              if (!order) {
                const { id, userId, createdAt } = cur.orders;
                const { productId, price, quantity } = cur.order_items;
                prev[id] = {
                  id,
                  userId,
                  createdAt,
                  items: [
                    {
                      productId,
                      price,
                      quantity,
                    },
                  ],
                };
              } else {
                const { productId, price, quantity } = cur.order_items;
                order.items.push({
                  productId,
                  price,
                  quantity,
                });
              }
              return prev;
            },
            {} as Record<number, Out[number]>,
          ),
        ),
      ),
    );
  }
}

export { DrizzleRepository };
