import type { MinimalMeta } from "./meta";
import type { Options } from "./options";

function getNumberOfSkippedItems({ number, size }: Options) {
  return (number - 1) * size;
}

function getNumberOfPages({ numberOfItems, size }: Pick<MinimalMeta, "numberOfItems" | "size">) {
  return Math.ceil(numberOfItems / size);
}

function hasPreviousPage({ number, ...meta }: MinimalMeta) {
  return number > 1 && number <= getNumberOfPages(meta);
}

function hasNextPage({ number, ...meta }: MinimalMeta) {
  return number < getNumberOfPages(meta);
}

export { getNumberOfPages, getNumberOfSkippedItems, hasNextPage, hasPreviousPage };
