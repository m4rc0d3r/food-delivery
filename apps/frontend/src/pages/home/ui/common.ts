import { Pagination } from "@workspace/core";
import type { Dispatch, SetStateAction } from "react";

function defineListParamsChangeHandlers<Filter, Sorting, Pagination extends Pagination.Options>(
  setFilter: Dispatch<SetStateAction<Filter>>,
  setSorting: Dispatch<SetStateAction<Sorting>>,
  setPagination: Dispatch<SetStateAction<Pagination>>,
) {
  const handleFilterChange: typeof setFilter = (value) => {
    setFilter(value);
    resetPagination();
  };

  const handleSortChange: typeof setSorting = (value) => {
    setSorting(value);
    resetPagination();
  };

  const resetPagination = () => {
    setPagination((prev) => ({ ...prev, number: Pagination.DEFAULT_OPTIONS.number }));
  };

  return {
    handleFilterChange,
    handleSortChange,
  };
}

export { defineListParamsChangeHandlers };
