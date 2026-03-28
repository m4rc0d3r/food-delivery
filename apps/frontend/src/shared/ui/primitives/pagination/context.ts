import { useContext } from "react";

import { createContextWithDisplayName } from "@/shared/react";

type PaginationState = {
  total: number;
  itemsPerPage: number;
  pageCount: number;
  currentPage: number;
  siblingCount: number;
  showEdges: boolean;
  onPageChange?: ((value: number) => void) | undefined;
  onItemsPerPageChange?: ((value: number) => void) | undefined;
};

const DEFAULT_PAGINATION_STATE: PaginationState = {
  total: 0,
  itemsPerPage: 0,
  pageCount: 0,
  currentPage: 1,
  siblingCount: 1,
  showEdges: true,
};

const PaginationContext = createContextWithDisplayName(
  DEFAULT_PAGINATION_STATE,
  "PaginationContext",
);

function usePagination() {
  return useContext(PaginationContext);
}

export { DEFAULT_PAGINATION_STATE, PaginationContext, usePagination };
export type { PaginationState };
