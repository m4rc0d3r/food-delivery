import { Str } from "@workspace/core";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  MoreHorizontalIcon,
} from "lucide-react";
import { Slot } from "radix-ui";
import type { ComponentProps, ComponentType, ReactNode } from "react";
import { z } from "zod";

import { cn } from "../../lib";
import { Button } from "../button";

import type { PaginationState } from "./context";
import { DEFAULT_PAGINATION_STATE, PaginationContext, usePagination } from "./context";
import type { Pages } from "./utils";
import { getRange, transform } from "./utils";

type PaginationProps = ComponentProps<"nav"> &
  Omit<PaginationState, "siblingCount" | "showEdges"> & {
    siblingCount?: number | undefined;
    showEdges?: boolean | undefined;
  };

function Pagination({
  total,
  itemsPerPage,
  pageCount,
  currentPage,
  siblingCount = DEFAULT_PAGINATION_STATE.siblingCount,
  showEdges = DEFAULT_PAGINATION_STATE.showEdges,
  onPageChange,
  onItemsPerPageChange,
  ...props
}: PaginationProps) {
  return (
    <PaginationContext.Provider
      value={{
        total,
        itemsPerPage,
        pageCount,
        currentPage,
        siblingCount,
        showEdges,
        onPageChange,
        onItemsPerPageChange,
      }}
    >
      <nav role="navigation" aria-label="pagination" data-slot="pagination" {...props} />
    </PaginationContext.Provider>
  );
}

type PaginationContentProps = ComponentProps<"ul"> & {
  withFirstAndLast?: boolean | undefined;
  withPreviousAndNext?: boolean | undefined;
  render?: ((pages: Pages, activePage: number) => ReactNode) | undefined;
};

function PaginationContent({
  withFirstAndLast = false,
  withPreviousAndNext = true,
  render,
  className,
  children,
  ...props
}: PaginationContentProps) {
  const { currentPage, pageCount, siblingCount, showEdges } = usePagination();

  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    >
      {withFirstAndLast && (
        <PaginationItem>
          <PaginationFirst />
        </PaginationItem>
      )}
      {withPreviousAndNext && (
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
      )}
      {render?.(
        transform(getRange(currentPage, pageCount, siblingCount, showEdges)),
        currentPage,
      ) ?? children}
      {withPreviousAndNext && (
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      )}
      {withFirstAndLast && (
        <PaginationItem>
          <PaginationLast />
        </PaginationItem>
      )}
    </ul>
  );
}

function PaginationItem({ ...props }: ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = ComponentProps<typeof Button> & {
  page: number;
  asChild?: boolean;
  isActive?: boolean;
};

function PaginationLink({
  page,
  asChild = false,
  isActive = false,
  variant = isActive ? "outline" : "ghost",
  size = "icon",
  onClick,
  className,
  children,
  ...props
}: PaginationLinkProps) {
  const { onPageChange } = usePagination();

  const handleClick: typeof onClick = (event) => {
    onPageChange?.(page);
    onClick?.(event);
  };

  const Comp = asChild ? Slot.Root : Button;

  return (
    <Comp
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleClick}
      {...props}
    >
      {children ?? page}
    </Comp>
  );
}

function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("relative flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

type PredefinedPaginationLinkWithoutTargetProps = Omit<PredefinedPaginationLinkProps, "target">;

function PaginationFirst({ ...props }: PredefinedPaginationLinkWithoutTargetProps) {
  return <PredefinedPaginationLink target={"FIRST"} {...props} />;
}

function PaginationPrevious({ ...props }: PredefinedPaginationLinkWithoutTargetProps) {
  return <PredefinedPaginationLink target={"PREVIOUS"} {...props} />;
}

function PaginationNext({ className, ...props }: PredefinedPaginationLinkWithoutTargetProps) {
  return <PredefinedPaginationLink target={"NEXT"} {...props} />;
}

function PaginationLast({ className, ...props }: PredefinedPaginationLinkWithoutTargetProps) {
  return <PredefinedPaginationLink target={"LAST"} {...props} />;
}

const _zPredefinedPaginationLinkTarget = z.enum(["FIRST", "PREVIOUS", "NEXT", "LAST"]);
type PredefinedPaginationLinkTarget = z.infer<typeof _zPredefinedPaginationLinkTarget>;

const ICONS_BY_TARGET: Record<
  keyof (typeof _zPredefinedPaginationLinkTarget)["enum"],
  ComponentType
> = {
  FIRST: ChevronFirst,
  PREVIOUS: ChevronLeft,
  NEXT: ChevronRight,
  LAST: ChevronLast,
};

type PredefinedPaginationLinkProps = Omit<PaginationLinkProps, "page"> & {
  target: PredefinedPaginationLinkTarget;
};

function PredefinedPaginationLink({
  target,
  disabled,
  className,
  children,
  ...props
}: PredefinedPaginationLinkProps) {
  const { currentPage, pageCount } = usePagination();

  const PAGE_NUMBERS_BY_TARGET: Record<
    keyof (typeof _zPredefinedPaginationLinkTarget)["enum"],
    number
  > = {
    FIRST: 1,
    PREVIOUS: currentPage - 1,
    NEXT: currentPage + 1,
    LAST: pageCount,
  };
  const page = PAGE_NUMBERS_BY_TARGET[target];

  const Icon = ICONS_BY_TARGET[target];

  const disabled_ =
    (["FIRST", "PREVIOUS"].includes(target) && currentPage === 1) ||
    (["NEXT", "LAST"].includes(target) && (currentPage === pageCount || pageCount === 0));

  return (
    <PaginationLink
      page={page}
      disabled={disabled ?? disabled_}
      aria-label={["Go to", target.toLocaleLowerCase(), "page"].join(Str.SPACE)}
      className={cn(className)}
      {...props}
    >
      {children ?? (Icon && <Icon />) ?? Str.capitalize(target.toLocaleLowerCase())}
    </PaginationLink>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
