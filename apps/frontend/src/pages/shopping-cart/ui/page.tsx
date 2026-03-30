import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Domain, iife, Str } from "@workspace/core";
import { Copy, Minus, Plus, Trash } from "lucide-react";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import type { Entries } from "type-fest";

import { AuthServicePorts, AuthStatus, useAuthStore } from "@/entities/auth";
import { useDiContainer } from "@/entities/di";
import { OrderQuery } from "@/entities/order";
import { ShoppingCartStore } from "@/entities/shopping-cart";
import { UserQuery } from "@/entities/user";
import { UniqueKeyViolationError } from "@/shared/errors";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "@/shared/ui/primitives";

const _FIELD_NAMES = ["fullName", "email", "phone", "address"] as const;
type FieldName = (typeof _FIELD_NAMES)[number];

type FieldConfig = {
  name: FieldName;
  label: string;
  description: string;
  inputProps?: ComponentProps<typeof Input> | undefined;
};

const FIELDS_CONFIG: Record<FieldConfig["name"], Omit<FieldConfig, "name">> = {
  fullName: {
    label: "Full name",
    description: "First and last name",
  },
  email: {
    label: "Email",
    description: "Any email address",
    inputProps: {
      placeholder: ["*".repeat(8), "example.com"].join("@"),
    },
  },
  phone: {
    label: "Phone number",
    description: "Phone number must start with +",
    inputProps: {
      placeholder: ["*".repeat(8), "example.com"].join("@"),
    },
  },
  address: {
    label: "Address",
    description: "City, street, house number",
    inputProps: {
      placeholder: ["*".repeat(8), "example.com"].join("@"),
    },
  },
};

const FORM_ID = "personalInformationForm"; // 1.31 kB

const zSchema = AuthServicePorts.ProviderIos.Register.zIn;

function ShoppingCartPage() {
  const navigate = useNavigate();

  const { userService, orderService } = useDiContainer();
  const { mutate: createByAuth, isPending: isCreateByAuthPending } =
    OrderQuery.useCreateByAuth(orderService);
  const { mutate: createByUnauth, isPending: isCreateByUnauthPending } =
    OrderQuery.useCreateByUnauth(orderService);
  const { data: me } = UserQuery.useGetMe(userService, {
    retry: false,
  });

  const isCreatePending = isCreateByAuthPending || isCreateByUnauthPending;

  const loginLocally = useAuthStore.use.login();

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    },
    validators: {
      onChange: zSchema.omit({
        password: true,
      }),
    },
    onSubmit: ({ value }) => {
      if (status === AuthStatus.UNAUTHENTICATED) {
        createByUnauth(
          {
            user: value,
            items: shoppingCartItems,
          },
          {
            onSuccess: ({ userPassword }) => {
              loginLocally();
              toast.success("The order has been created");
              toast.success("An account has been created with the information you provided.", {
                description: (
                  <div>
                    <ul>
                      {(Object.entries(FIELDS_CONFIG) as Entries<typeof FIELDS_CONFIG>).map(
                        ([name, { label }]) => (
                          <li key={name}>
                            <span>
                              {label}: {value[name]}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                    <div className="flex gap-2">
                      <span>Password: {userPassword}</span>
                      <Button variant="outline" size="icon">
                        <Copy />
                      </Button>
                    </div>
                  </div>
                ),
              });
              void navigate({
                to: "/orders",
              });
            },
            onError: (error) => {
              toast.error("Failed to create order", {
                description: iife(() => {
                  if (error instanceof UniqueKeyViolationError) {
                    if (error.constraintName === Domain.User.Constraint.UNIQUE_USER_EMAIL)
                      return "This email address is taken by another user.";
                    if (error.constraintName === Domain.User.Constraint.UNIQUE_USER_PHONE)
                      return "This phone number is taken by another user.";
                  }

                  return "An unexpected error occurred, please try again later";
                }),
              });
            },
          },
        );
      }
    },
  });

  const isFieldInvalid = (
    submissionAttempts: number,
    {
      isTouched,
      isValid,
    }: Parameters<ComponentProps<typeof form.Field>["children"]>[0]["state"]["meta"],
  ) => submissionAttempts > 0 && isTouched && !isValid;

  const handleSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();
    void form.handleSubmit();
  };
  const status = useAuthStore.use.status();
  const shoppingCartItems = ShoppingCartStore.useStore.use.items();

  return (
    <div className="flex grow gap-2 py-2 max-sm:flex-col">
      <aside className="flex w-1/2 flex-col gap-4 px-2 max-sm:w-full">
        {status === AuthStatus.UNAUTHENTICATED ? (
          <div className="flex grow flex-col">
            <Card className="m-auto min-w-1/2">
              <CardHeader className="*:text-center">
                <CardTitle>Personal information</CardTitle>
                <CardDescription>Please provide your details.</CardDescription>
              </CardHeader>
              <CardContent>
                <form id={FORM_ID} onSubmit={handleSubmit}>
                  <FieldGroup>
                    {Object.entries(FIELDS_CONFIG).map(
                      ([name, { label, description, inputProps }]) => (
                        <form.Subscribe
                          key={name}
                          selector={({ submissionAttempts }) => submissionAttempts}
                        >
                          {(submissionAttempts) => (
                            <form.Field name={name as FieldName}>
                              {(field) => {
                                const isInvalid = isFieldInvalid(
                                  submissionAttempts,
                                  field.state.meta,
                                );
                                return (
                                  <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                                    <Input
                                      id={field.name}
                                      name={field.name}
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      onChange={(e) => field.handleChange(e.target.value)}
                                      aria-invalid={isInvalid}
                                      autoComplete="off"
                                      {...inputProps}
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    <FieldDescription>{description}</FieldDescription>
                                  </Field>
                                );
                              }}
                            </form.Field>
                          )}
                        </form.Subscribe>
                      ),
                    )}
                  </FieldGroup>
                </form>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Field orientation="responsive">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isCreatePending}
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                </Field>
              </CardFooter>
            </Card>
            <Button
              type="submit"
              size="auto"
              className="px-6 py-2 text-4xl"
              disabled={isCreatePending}
              form={FORM_ID}
            >
              Make an order
            </Button>
          </div>
        ) : status === AuthStatus.AUTHENTICATED ? (
          <div className="flex grow flex-col">
            <ul>
              {(Object.entries(FIELDS_CONFIG) as Entries<typeof FIELDS_CONFIG>).map(
                ([name, { label }]) => (
                  <li key={name}>
                    <span>
                      {label}: {me?.[name]}
                    </span>
                  </li>
                ),
              )}
            </ul>
            <Button
              type="button"
              size="auto"
              className="px-6 py-2 text-4xl"
              disabled={isCreatePending}
              onClick={() => {
                createByAuth(
                  {
                    items: shoppingCartItems,
                  },
                  {
                    onSuccess: () => {
                      loginLocally();
                      toast.success("The order has been created");
                      void navigate({
                        to: "/orders",
                      });
                    },
                    onError: () => {
                      toast.error("Failed to create order", {
                        description: "An unexpected error occurred, please try again later",
                      });
                    },
                  },
                );
              }}
            >
              Make an order
            </Button>
          </div>
        ) : (
          <div></div>
        )}
      </aside>
      <div className="flex grow flex-col gap-2 px-6">
        <h3 className="text-3xl font-bold max-sm:text-center">Items in the cart</h3>
        <ul className="flex flex-col gap-4 overflow-auto">
          {shoppingCartItems.map(({ storeId, productId, quantity }) => (
            <li key={[storeId, productId].join(Str.EMPTY)}>
              <Card>
                <CardHeader>
                  <CardTitle>Store ID: {storeId}</CardTitle>
                  <CardDescription>Product ID: {productId}</CardDescription>
                  <CardAction>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        ShoppingCartStore.remove({
                          storeId,
                          productId,
                        })
                      }
                    >
                      <Trash />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">Price: {232.43}</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={quantity <= 1}
                    onClick={() =>
                      ShoppingCartStore.changeQuantity({
                        storeId,
                        productId,
                        quantity: (prev) => prev - 1,
                      })
                    }
                  >
                    <Minus />
                  </Button>
                  <p className="font-bold">Quantity: {quantity}</p>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      ShoppingCartStore.changeQuantity({
                        storeId,
                        productId,
                        quantity: (prev) => prev + 1,
                      })
                    }
                  >
                    <Plus />
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { ShoppingCartPage };
