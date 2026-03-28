import { useNavigate, useRouterState } from "@tanstack/react-router";
import type { Rec } from "@workspace/core";
import type { ComponentType } from "react";
import { createElement, useEffect } from "react";

import type { useAuthStore } from "../model";
import { AuthStatus } from "../model";

type Props<ComponentProps extends Record<string, unknown>> = {
  useAuthResolver: () => Rec.WithoutMethods<ReturnType<typeof useAuthStore.getState>>;
  allowAccessTo: {
    status: Exclude<AuthStatus, typeof AuthStatus.UNCERTAIN>;
  };
  Component: ComponentType<ComponentProps>;
  componentProps?: ComponentProps | undefined;
  onForbid?: ((navigate: ReturnType<typeof useNavigate>) => void) | undefined;
};

function Protected<ComponentProps extends Record<string, unknown>>(props: Props<ComponentProps>) {
  const Protected = () => <WithProtection {...props} />;
  return Protected;
}

function WithProtection<ComponentProps extends Record<string, unknown>>({
  useAuthResolver,
  allowAccessTo,
  Component,
  componentProps,
  onForbid,
}: Props<ComponentProps>) {
  const routerStatus = useRouterState({
    select: ({ status }) => status,
  });
  const navigate = useNavigate();

  const { status } = useAuthResolver();

  const isAccessGranted = status === allowAccessTo.status;

  useEffect(() => {
    if (status === AuthStatus.UNCERTAIN || isAccessGranted || routerStatus === "pending") return;

    onForbid?.(navigate);
  }, [isAccessGranted, navigate, onForbid, routerStatus, status]);

  if (isAccessGranted) return createElement(Component, componentProps);

  return null;
}

export { Protected };
