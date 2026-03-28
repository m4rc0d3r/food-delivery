import { useForm } from "@tanstack/react-form-start";
import { debounce } from "@tanstack/react-pacer";
import { keepPreviousData } from "@tanstack/react-query";
import { Domain, Pagination, range, Sorting, Str } from "@workspace/core";
import { zStoreRepositoryIosListIn } from "backend";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Funnel } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type z from "zod";

import { StoreCard } from "./store-card";
import { StoreCardSkeleton } from "./store-card/skeleton";

import { useDiContainer } from "@/entities/di";
import type { Store } from "@/entities/store";
import { StoreQuery } from "@/entities/store";
import { DEBOUNCE_TIME } from "@/shared/pacer";
import {
  Badge,
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  Pagination as PaginationRoot,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/primitives";
import { QueryError } from "@/shared/ui/query-error";

const zFilter = zStoreRepositoryIosListIn.shape.filter;
type Filter = z.infer<typeof zFilter>;

const zSorting2 = zStoreRepositoryIosListIn.shape.sorting;
type Sorting2 = z.infer<typeof zSorting2>;

function HomePage() {
  const { storeService } = useDiContainer();

  const [filter, setFilter] = useState<Filter>({
    rating: {
      minimum: Domain.Store.Attribute.Rating.CONSTRAINTS.value.minimum,
      maximum: Domain.Store.Attribute.Rating.CONSTRAINTS.value.maximum,
    },
  });
  const [sorting, setSorting] = useState<Sorting2>({
    field: "name",
    direction: Sorting.Direction.ASC,
  });
  const [pagination, setPagination] = useState(Pagination.DEFAULT_OPTIONS);

  const { handleFilterChange, handleSortChange } = defineListParamsChangeHandlers(
    setFilter,
    setSorting,
    setPagination,
  );

  const debounceFilter = debounce(
    (value: Parameters<typeof handleFilterChange>[0]) => handleFilterChange(value),
    {
      wait: DEBOUNCE_TIME,
    },
  );

  const {
    data: stores,
    isPending: isPendingStores,
    isError: isErrorStores,
    refetch: refetchStores,
  } = StoreQuery.useList(
    storeService,
    {
      filter,
      sorting,
      pagination,
    },
    {
      placeholderData: keepPreviousData,
      retry: false,
    },
  );

  const filterForm = useForm({
    defaultValues: filter,
    validators: {
      onChange: zFilter,
    },
  });

  const sortingForm = useForm({
    defaultValues: sorting,
    validators: {
      onChange: zSorting2,
    },
  });

  const isFieldInvalid = ({ isTouched, isValid }: { isTouched: boolean; isValid: boolean }) =>
    isTouched && !isValid;

  const [selectedStoreId, setSelectedStoreId] = useState<Store["id"] | null>(null);

  return (
    <div className="flex grow">
      <aside className="flex flex-col gap-4 px-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-4xl font-bold">Stores</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Funnel />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <PopoverHeader>
                <PopoverTitle>List options</PopoverTitle>
                <PopoverDescription>Filter and sort stores by name and rating.</PopoverDescription>
              </PopoverHeader>
              <form>
                <FieldGroup>
                  <filterForm.Field
                    name="name"
                    listeners={{
                      onChange: ({ value }) => {
                        debounceFilter((prev) => ({
                          ...prev,
                          name: value || undefined,
                        }));
                      },
                    }}
                  >
                    {(field) => {
                      const isInvalid = isFieldInvalid(field.state.meta);
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                          <FieldDescription>Enter part of the name</FieldDescription>
                        </Field>
                      );
                    }}
                  </filterForm.Field>
                  <filterForm.Field
                    name="rating"
                    listeners={{
                      onChange: ({ value }) => {
                        debounceFilter((prev) => ({
                          ...prev,
                          rating: value,
                        }));
                      },
                    }}
                  >
                    {(field) => {
                      const isInvalid = isFieldInvalid(field.state.meta);
                      return (
                        <Field data-invalid={isInvalid} className="">
                          <FieldLabel htmlFor={field.name}>Rating</FieldLabel>
                          <div className="flex gap-2">
                            {(
                              [
                                {
                                  subName: "minimum",
                                  placeholder: "From",
                                },
                                {
                                  subName: "maximum",
                                  placeholder: "To",
                                },
                              ] as const
                            ).map(({ subName, placeholder }) => {
                              const fieldName = [field.name, subName].join(".");
                              return (
                                <Input
                                  key={fieldName}
                                  id={fieldName}
                                  name={fieldName}
                                  value={field.state.value?.[subName]}
                                  onBlur={field.handleBlur}
                                  onChange={(e) => {
                                    const value = e.target.valueAsNumber;
                                    if (
                                      !zFilter
                                        .unwrap()
                                        .shape.rating.unwrap()
                                        .shape[subName].safeParse(value).success
                                    )
                                      return;

                                    field.handleChange((prev) => ({
                                      ...prev,
                                      [subName]: value,
                                    }));
                                  }}
                                  aria-invalid={isInvalid}
                                  autoComplete="off"
                                  type="number"
                                  min={Domain.Store.Attribute.Rating.CONSTRAINTS.value.minimum}
                                  max={Domain.Store.Attribute.Rating.CONSTRAINTS.value.maximum}
                                  step={0.1}
                                  placeholder={placeholder}
                                />
                              );
                            })}
                          </div>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                          <FieldDescription>Enter the minimum and maximum rating</FieldDescription>
                        </Field>
                      );
                    }}
                  </filterForm.Field>
                </FieldGroup>
              </form>
              <form>
                <FieldGroup>
                  <sortingForm.Field
                    name="field"
                    listeners={{
                      onChange: ({ value }) => {
                        handleSortChange((prev) => ({
                          ...prev,
                          field: value,
                        }));
                      },
                    }}
                  >
                    {(field) => {
                      const isInvalid = isFieldInvalid(field.state.meta);
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Sort by</FieldLabel>
                          <div className="flex gap-2">
                            <Select
                              name={field.name}
                              value={field.state.value}
                              onValueChange={(value) =>
                                field.handleChange(value as Sorting2["field"])
                              }
                            >
                              <SelectTrigger
                                id={field.name}
                                className="w-full"
                                aria-invalid={isInvalid}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent position="item-aligned">
                                {zSorting2.shape.field.options.map((value) => (
                                  <SelectItem key={value} value={value}>
                                    {Str.capitalize(value)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="outline"
                              size="auto"
                              className="flex items-center gap-1 px-2"
                              onClick={() => {
                                handleSortChange((prev) => ({
                                  ...prev,
                                  direction:
                                    sorting.direction === Sorting.Direction.ASC
                                      ? Sorting.Direction.DESC
                                      : Sorting.Direction.ASC,
                                }));
                              }}
                            >
                              {sorting.direction === Sorting.Direction.ASC ? (
                                <ArrowUpNarrowWide />
                              ) : (
                                <ArrowDownNarrowWide />
                              )}
                              {sorting.direction}
                            </Button>
                          </div>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      );
                    }}
                  </sortingForm.Field>
                </FieldGroup>
              </form>
              {stores && (
                <PaginationRoot
                  total={stores.meta.numberOfItems}
                  itemsPerPage={stores.meta.size}
                  pageCount={stores.meta.numberOfPages}
                  currentPage={stores.meta.number}
                  onPageChange={(value) =>
                    setPagination((prev) => ({
                      ...prev,
                      number: value,
                    }))
                  }
                >
                  <PaginationContent
                    className="justify-center"
                    render={(pages, activePage) =>
                      pages.map((page, index) => (
                        <PaginationItem key={index}>
                          {page.type === "page" ? (
                            <PaginationLink
                              page={page.value}
                              isActive={page.value === activePage}
                            />
                          ) : (
                            <PaginationEllipsis />
                          )}
                        </PaginationItem>
                      ))
                    }
                  />
                </PaginationRoot>
              )}
            </PopoverContent>
          </Popover>
        </div>
        {isErrorStores ? (
          <QueryError onTryAgain={() => void refetchStores()} />
        ) : isPendingStores ? (
          <ul className="flex grow flex-col gap-4 overflow-auto">
            {range(Pagination.DEFAULT_OPTIONS.size).map((value) => (
              <li key={value}>
                <StoreCardSkeleton />
              </li>
            ))}
          </ul>
        ) : stores.data.length ? (
          <ul className="flex grow flex-col gap-4 overflow-auto">
            {stores.data.map((store) => (
              <li key={store.id}>
                <button
                  type="button"
                  className="relative"
                  onClick={() => setSelectedStoreId(store.id)}
                >
                  <StoreCard store={store} />
                  {store.id === selectedStoreId && (
                    <Badge className="absolute top-0 right-0 bg-green-600 text-lg">Selected</Badge>
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No stores found</p>
        )}
      </aside>
      <div className="flex grow">
        <h3 className="m-auto text-5xl">Products</h3>
      </div>
    </div>
  );
}

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

export { HomePage };
