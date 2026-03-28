import { useForm } from "@tanstack/react-form-start";
import { Link, useNavigate } from "@tanstack/react-router";
import { iife } from "@workspace/core";
import type { ComponentProps } from "react";
import { toast } from "sonner";

import { AuthQuery, AuthServicePorts, useAuthStore } from "@/entities/auth";
import { useDiContainer } from "@/entities/di";
import { NotFoundError } from "@/shared/errors";
import {
  Button,
  Card,
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

const _FIELD_NAMES = ["emailOrPhone", "password"] as const;
type FieldName = (typeof _FIELD_NAMES)[number];

type FieldConfig = {
  name: FieldName;
  label: string;
  description: string;
  inputProps?: ComponentProps<typeof Input> | undefined;
};

const FIELDS_CONFIG: Record<FieldConfig["name"], Omit<FieldConfig, "name">> = {
  emailOrPhone: {
    label: "Email or phone",
    description: "Phone number must start with +",
    inputProps: {
      placeholder: ["*".repeat(8), "example.com"].join("@"),
    },
  },
  password: {
    label: "password",
    description: "Come up with a complex password",
    inputProps: {
      type: "password",
      placeholder: "*".repeat(6),
    },
  },
};

const FORM_ID = "loginForm"; // 1.31 kB

const zSchema = AuthServicePorts.ProviderIos.Login.zIn;

function LoginPage() {
  const navigate = useNavigate();

  const { authService } = useDiContainer();
  const { mutate: login, isPending: isLoginPending } = AuthQuery.useLogin(authService);

  const loginLocally = useAuthStore.use.login();

  const form = useForm({
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
    validators: {
      onChange: zSchema,
    },
    onSubmit: ({ value }) => {
      login(value, {
        onSuccess: () => {
          loginLocally();
          void navigate({
            to: "/",
          });
        },
        onError: (error) => {
          toast.error("Failed to log in to your account", {
            description: iife(() => {
              if (error instanceof NotFoundError) {
                return "Incorrect email address and/or password";
              }

              return "An unexpected error occurred, please try again later";
            }),
          });
        },
      });
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

  return (
    <div className="flex h-full">
      <Card className="m-auto min-w-1/2">
        <CardHeader className="*:text-center">
          <CardTitle>Account login</CardTitle>
          <CardDescription>
            Enter your login details to access information related to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id={FORM_ID} onSubmit={handleSubmit}>
            <FieldGroup>
              {Object.entries(FIELDS_CONFIG).map(([name, { label, description, inputProps }]) => (
                <form.Subscribe
                  key={name}
                  selector={({ submissionAttempts }) => submissionAttempts}
                >
                  {(submissionAttempts) => (
                    <form.Field name={name as FieldName}>
                      {(field) => {
                        const isInvalid = isFieldInvalid(submissionAttempts, field.state.meta);
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
              ))}
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Field orientation="responsive">
            <Button type="submit" disabled={isLoginPending} form={FORM_ID}>
              Log in
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isLoginPending}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </Field>
          <p>
            Don&apos;t have an account?
            <Button asChild variant="link">
              <Link to="/register">Create</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export { LoginPage };
