import { keepPreviousData } from "@tanstack/react-query";
import { Pagination, range } from "@workspace/core";

import { useDiContainer } from "@/entities/di";
import { OrderQuery } from "@/entities/order";
import { formatDate } from "@/shared/i18n";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/shared/ui/primitives";
import { QueryError } from "@/shared/ui/query-error";

function OrdersPage() {
  const { orderService } = useDiContainer();

  const {
    data: orders,
    isPending: isPendingOrders,
    isError: isErrorOrders,
    refetch: refetchOrders,
  } = OrderQuery.useList(
    orderService,
    {
      pagination: Pagination.DEFAULT_OPTIONS,
    },
    {
      placeholderData: keepPreviousData,
      retry: false,
    },
  );

  return (
    <div className="flex grow flex-col p-4">
      {isErrorOrders ? (
        <QueryError onTryAgain={() => void refetchOrders()} />
      ) : isPendingOrders ? (
        <ul className="flex grow flex-col gap-4 overflow-auto">
          {range(Pagination.DEFAULT_OPTIONS.size).map((value) => (
            <li key={value}>
              <Skeleton className="size-full" />
            </li>
          ))}
        </ul>
      ) : orders.length ? (
        <ul className="grid grid-cols-1 gap-4 overflow-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders.map(({ id, createdAt, items }) => (
            <li key={id}>
              <Card>
                <CardHeader>
                  <CardTitle>Order {id}</CardTitle>
                  <CardDescription>Created on: {formatDate(createdAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Items</p>
                  <ul className="flex flex-col gap-4">
                    {items.map(({ productId, price, quantity }) => (
                      <li key={productId} className="flex flex-col gap-1">
                        <span>Product ID: {productId}</span>
                        <span>Price: {price}</span>
                        <span>QuantityD: {quantity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-auto text-center text-4xl">No orders found</p>
      )}
    </div>
  );
}

export { OrdersPage };
