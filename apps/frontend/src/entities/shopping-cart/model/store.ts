import { zFromJson } from "@workspace/core";
import { either, function as function_ } from "fp-ts";
import type { SetStateAction } from "react";
import { z } from "zod";
import { create } from "zustand";
import type { StorageValue } from "zustand/middleware";
import { devtools, persist } from "zustand/middleware";

import type { ShoppingCart } from "./shopping-cart";
import { zShoppingCart } from "./shopping-cart";

import { getValueOfSetStateAction } from "@/shared/react";
import { createSelectors } from "@/shared/zustand";

type Item = ShoppingCart[number];
type ItemId = Pick<Item, "storeId" | "productId">;

const zState = z.object({ items: zShoppingCart });
type State = z.infer<typeof zState>;

const zStore = z.object({
  state: zState,
  version: z.number().optional(),
});

const initialState: State = {
  items: [],
};

const STORE_NAME = "ShoppingCartStore";

const useStore = createSelectors(
  create<State>()(
    persist(
      devtools(() => initialState, {
        store: STORE_NAME,
      }),
      {
        name: STORE_NAME,
        storage: {
          getItem: (
            name: string,
          ): StorageValue<State> | Promise<StorageValue<State> | null> | null => {
            return function_.pipe(
              localStorage.getItem(name),
              either.fromNullable(null),
              either.map((storedValue) => zFromJson(zStore).safeParse(storedValue)),
              either.flatMap(({ success, data, error }) =>
                success ? either.right(data) : either.left(error),
              ),
              either.mapLeft(() => null),
              either.map(({ state, version }) => ({
                state,
                ...(typeof version === "number" && {
                  version,
                }),
              })),
              either.toUnion,
            );
          },
          setItem: (name: string, value: StorageValue<State>): unknown => {
            return localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name: string): unknown => {
            return localStorage.removeItem(name);
          },
        },
      },
    ),
  ),
);

function add({ storeId, productId }: ItemId) {
  useStore.setState(({ items }) => ({
    items: items.some((value) => value.storeId === storeId && value.productId === productId)
      ? items
      : [
          ...items,
          {
            storeId,
            productId,
            quantity: 1,
          },
        ],
  }));
}

function remove({ storeId, productId }: ItemId) {
  useStore.setState(({ items }) => ({
    items: items.filter((value) => value.storeId !== storeId || value.productId !== productId),
  }));
}

function changeQuantity({
  storeId,
  productId,
  quantity,
}: ItemId & {
  quantity: SetStateAction<Item["quantity"]>;
}) {
  useStore.setState(({ items }) => ({
    items: items.map((value) =>
      value.storeId === storeId && value.productId === productId
        ? {
            ...value,
            quantity: getValueOfSetStateAction(quantity, value.quantity),
          }
        : value,
    ),
  }));
}

function clear() {
  useStore.setState(useStore.getInitialState());
}

export { add, changeQuantity, clear, remove, useStore };
