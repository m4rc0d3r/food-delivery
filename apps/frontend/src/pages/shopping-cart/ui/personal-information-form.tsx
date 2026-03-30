import { useForm } from "@tanstack/react-form-start";
import { useNavigate } from "@tanstack/react-router";
import { Domain, iife } from "@workspace/core";
import type { ComponentProps } from "react";
import { toast } from "sonner";

import { AuthQuery, AuthServicePorts, useAuthStore } from "@/entities/auth";
import { useDiContainer } from "@/entities/di";
import { UniqueKeyViolationError } from "@/shared/errors";
import { cn } from "@/shared/ui/lib";
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

type Props = ComponentProps<"div">;

function PersonalInformationForm({ className, ...props }: Props) {
  const navigate = useNavigate();

  const { authService } = useDiContainer();
  const { mutate: register, isPending: isRegistrationPending } = AuthQuery.useRegister(authService);

  const loginLocally = useAuthStore.use.login();

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
    },
    validators: {
      onChange: zSchema,
    },
    onSubmit: ({ value }) => {
      register(value, {
        onSuccess: () => {
          loginLocally();
          void navigate({
            to: "/",
          });
        },
        onError: (error) => {
          toast.error("Failed to log in to your account", {
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
    <div className={cn("flex grow", className)} {...props}>
      <Card className="m-auto min-w-1/2">
        <CardHeader className="*:text-center">
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Please provide your details.</CardDescription>
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
            <Button type="submit" disabled={isRegistrationPending} form={FORM_ID}>
              Order
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isRegistrationPending}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}

export { PersonalInformationForm };
