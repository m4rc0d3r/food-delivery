import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { useAuthResolver } from "../-common";

import { AuthStatus, Protected } from "@/entities/auth";
import { LoginPage } from "@/pages/login";

export const Route = createFileRoute("/_auth/login")({
  component: Protected({
    useAuthResolver,
    allowAccessTo: {
      status: AuthStatus.UNAUTHENTICATED,
    },
    Component: LoginPage,
    onForbid: (navigate) => {
      toast("You are already authenticated, so access to the login page is blocked.");
      void navigate({
        to: "/",
      });
    },
  }),
});
