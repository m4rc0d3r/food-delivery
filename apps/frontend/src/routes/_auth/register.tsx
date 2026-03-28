import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { useAuthResolver } from "../-common";

import { AuthStatus, Protected } from "@/entities/auth";
import { RegistrationPage } from "@/pages/registration";

export const Route = createFileRoute("/_auth/register")({
  component: Protected({
    useAuthResolver,
    allowAccessTo: {
      status: AuthStatus.UNAUTHENTICATED,
    },
    Component: RegistrationPage,
    onForbid: (navigate) => {
      toast("You are already authenticated, so access to the login page is blocked.");
      void navigate({
        to: "/",
      });
    },
  }),
});
