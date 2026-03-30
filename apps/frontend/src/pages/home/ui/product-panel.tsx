import { useForm, useStore } from "@tanstack/react-form";
import { debounce } from "@tanstack/react-pacer";
import { keepPreviousData } from "@tanstack/react-query";
import { Pagination, range, Sorting, Str } from "@workspace/core";
import { zStoreProductRepositoryIosListIn } from "backend";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Funnel } from "lucide-react";
import type { ComponentProps, CSSProperties } from "react";
import { useState } from "react";
import type z from "zod";

import { defineListParamsChangeHandlers } from "./common";
import { ProductCard } from "./product-card";

import type { Category } from "@/entities/category";
import { CategoryQuery } from "@/entities/category";
import { useDiContainer } from "@/entities/di";
import { ShoppingCartStore } from "@/entities/shopping-cart";
import type { Store } from "@/entities/store";
import { StoreProductQuery } from "@/entities/store-product";
import { DEBOUNCE_TIME } from "@/shared/pacer";
import { cn } from "@/shared/ui/lib";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
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
  Skeleton,
} from "@/shared/ui/primitives";
import { QueryError } from "@/shared/ui/query-error";

const zFilter = zStoreProductRepositoryIosListIn.shape.filter;
type Filter = z.infer<typeof zFilter>;

const zSorting2 = zStoreProductRepositoryIosListIn.shape.sorting;
type Sorting2 = z.infer<typeof zSorting2>;

type Props = ComponentProps<"div"> & {
  selectedStore: Store;
};

function ProductPanel({ selectedStore, className, ...props }: Props) {
  const { storeProductService, categoryService } = useDiContainer();

  const [filter, setFilter] = useState<Filter>({
    storeId: selectedStore.id,
    price: {
      minimum: 0.01,
      maximum: Number.MAX_SAFE_INTEGER,
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
    data: storeProducts,
    isPending: isPendingStoreProducts,
    isError: isErrorStoreProducts,
    refetch: refetchStoreProducts,
  } = StoreProductQuery.useList(
    storeProductService,
    selectedStore.id,
    {
      filter: {
        ...filter,
        storeId: selectedStore.id,
      },
      sorting,
      pagination,
    },
    {
      placeholderData: keepPreviousData,
      retry: false,
    },
  );
  const { data: categories } = CategoryQuery.useList(categoryService, {
    retry: false,
  });

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

  const categoriesForm = useForm({
    defaultValues: {
      ids: Object.fromEntries(categories?.map(({ id }) => [id, false]) ?? []),
    },
  });

  const isFieldInvalid = ({ isTouched, isValid }: { isTouched: boolean; isValid: boolean }) =>
    isTouched && !isValid;

  return (
    <div className={cn("flex grow flex-col gap-4 px-2", className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-4xl font-bold">
          Products from the &quot;{selectedStore.name}&quot; store
        </h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Funnel />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="max-h-(--radix-popover-content-available-height) overflow-auto"
          >
            <PopoverHeader>
              <PopoverTitle>List options</PopoverTitle>
              <PopoverDescription>Filter and sort products by name and price.</PopoverDescription>
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
                  name="price"
                  listeners={{
                    onChange: ({ value }) => {
                      debounceFilter((prev) => ({
                        ...prev,
                        price: value,
                      }));
                    },
                  }}
                >
                  {(field) => {
                    const isInvalid = isFieldInvalid(field.state.meta);
                    return (
                      <Field data-invalid={isInvalid} className="">
                        <FieldLabel htmlFor={field.name}>Price</FieldLabel>
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
                                    !zFilter.shape.price.unwrap().shape[subName].safeParse(value)
                                      .success
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
                                min={0.01}
                                step={0.01}
                                placeholder={placeholder}
                              />
                            );
                          })}
                        </div>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        <FieldDescription>Enter the minimum and maximum price</FieldDescription>
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
            <div>
              <h3 className="text-xl">Categories</h3>
              {categories && (
                <CategoryFilter
                  categories={categories}
                  form={categoriesForm as ComponentProps<typeof CategoryFilter>["form"]}
                  onChange={(id, value) => {
                    setFilter((prev) => {
                      const newCategories = value
                        ? [...(prev.categoryIds ?? []), id]
                        : prev.categoryIds?.filter((value) => value !== id);

                      return {
                        ...prev,
                        categoryIds:
                          !newCategories || newCategories.length === 0 ? undefined : newCategories,
                      };
                    });
                  }}
                />
              )}
            </div>
            {storeProducts && (
              <PaginationRoot
                total={storeProducts.meta.numberOfItems}
                itemsPerPage={storeProducts.meta.size}
                pageCount={storeProducts.meta.numberOfPages}
                currentPage={storeProducts.meta.number}
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
                          <PaginationLink page={page.value} isActive={page.value === activePage} />
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
      {isErrorStoreProducts ? (
        <QueryError onTryAgain={() => void refetchStoreProducts()} />
      ) : isPendingStoreProducts ? (
        <ul className="grid grow grid-cols-1 gap-4 overflow-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {range(Pagination.DEFAULT_OPTIONS.size).map((value) => (
            <li key={value}>
              <Skeleton className="size-full" />
            </li>
          ))}
        </ul>
      ) : storeProducts.data.length ? (
        <ul className="grid grow grid-cols-1 gap-4 overflow-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {storeProducts.data.map((product) => {
            const { storeId, productId } = product;

            return (
              <li key={[storeId, productId].join(Str.EMPTY)}>
                <ProductCard
                  product={product}
                  onAddToCart={() =>
                    ShoppingCartStore.add({
                      storeId,
                      productId,
                    })
                  }
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center">No products found</p>
      )}
    </div>
  );
}

type CategoryFilterProps = {
  categories: Category[];
  form: ReturnType<typeof useForm>;
} & Pick<CategoryFilterItemProps, "onChange">;

function CategoryFilter({ categories, form, onChange }: CategoryFilterProps) {
  return (
    <form>
      <CategoryFilterItem
        categories={reduceCategoriesToTree(categories)}
        form={form}
        depth={0}
        onChange={onChange}
        disableChildren={false}
      />
    </form>
  );
}

type CategoryFilterItemProps = {
  categories: TreeCategory[];
  form: ReturnType<typeof useForm>;
  depth: number;
  disableChildren: boolean;
  onChange: (id: Category["id"], value: boolean) => void;
};

function CategoryFilterItem({
  categories,
  form,
  depth,
  disableChildren,
  onChange,
}: CategoryFilterItemProps) {
  type FormValues = {
    ids: Record<Category["id"], boolean>;
  };

  useStore(form.store, (state) => (state.values as FormValues).ids);

  return (
    <Accordion
      type="multiple"
      style={
        {
          "--depth": `${depth}rem`,
        } as CSSProperties
      }
      className="pl-(--depth)"
    >
      {categories.map(({ id, name, children }) =>
        children.length > 0 ? (
          <AccordionItem key={id} value={id.toString()}>
            <AccordionTrigger>
              <FieldGroup>
                <form.Field
                  name={["ids", id].join(".")}
                  listeners={{
                    onChange: ({ value }) => onChange(id, (value as boolean) ?? false),
                  }}
                >
                  {(field) => {
                    return (
                      <div>
                        <FieldSet>
                          <FieldGroup data-slot="checkbox-group">
                            <Field orientation="horizontal">
                              <Checkbox
                                id={field.name}
                                name={field.name}
                                checked={field.state.value as boolean}
                                onCheckedChange={(checked) => field.handleChange(checked === true)}
                                disabled={disableChildren}
                                onClick={(event) => event.stopPropagation()}
                              />
                              <FieldLabel className="font-normal">{name}</FieldLabel>
                            </Field>
                          </FieldGroup>
                        </FieldSet>
                      </div>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </AccordionTrigger>
            <AccordionContent className="h-fit">
              <CategoryFilterItem
                categories={children}
                form={form}
                depth={depth + 1}
                disableChildren={(form.state.values as FormValues).ids[id] ?? false}
                onChange={onChange}
              />
            </AccordionContent>
          </AccordionItem>
        ) : (
          <FieldGroup key={id}>
            <form.Field name={["ids", id].join(".")}>
              {(field) => {
                return (
                  <div className="py-2.5">
                    <FieldSet>
                      <FieldGroup data-slot="checkbox-group">
                        <Field orientation="horizontal">
                          <Checkbox
                            id={field.name}
                            name={field.name}
                            checked={field.state.value as boolean}
                            onCheckedChange={(checked) => field.handleChange(checked === true)}
                          />
                          <FieldLabel htmlFor={field.name} className="font-normal">
                            {name}
                          </FieldLabel>
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  </div>
                );
              }}
            </form.Field>
          </FieldGroup>
        ),
      )}
    </Accordion>
  );
}

type TreeCategory = Category & {
  children: TreeCategory[];
};

function reduceCategoriesToTree(categories: Category[]) {
  const rootItems: TreeCategory[] = [];
  const lookup = Object.fromEntries(
    categories.map((category) => [
      category.id,
      {
        ...category,
        children: [],
      } as TreeCategory,
    ]),
  );

  for (const category of categories) {
    const treeItem = lookup[category.id]!;

    if (category.parentId !== null) {
      const { children } = lookup[category.parentId] ?? {};
      if (children) {
        children.push(treeItem);
      }
    } else {
      rootItems.push(treeItem);
    }
  }

  return rootItems;
}

export { ProductPanel };
