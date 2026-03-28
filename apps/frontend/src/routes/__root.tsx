/// <reference types="vite/client" />
import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { useState } from "react";

import appCss from "../styles/app.css?url";

import { AuthResolver } from "@/entities/auth";
import { DiContainerContext, initDiContainer } from "@/entities/di";
import type { Config } from "@/shared/config";
import { ConfigContext } from "@/shared/config";
import { ThemeProvider } from "@/shared/theming";
import { Toaster } from "@/shared/ui/primitives/sonner";

const queryClient = new QueryClient();

// eslint-disable-next-line react-refresh/only-export-components
function RootComponent() {
  const { config } = Route.useRouteContext();

  const [diContainer] = useState(() =>
    initDiContainer({
      config,
    }),
  );

  return (
    <RootDocument>
      <Toaster />
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ConfigContext.Provider value={config}>
            <DiContainerContext.Provider value={diContainer}>
              <AuthResolver userService={diContainer.userService} eventBus={diContainer.eventBus} />
              <Outlet />
            </DiContainerContext.Provider>
          </ConfigContext.Provider>
          <TanStackDevtools
            plugins={[
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: "TanStack Query",
                render: <ReactQueryDevtoolsPanel />,
              },
              formDevtoolsPlugin(),
            ]}
          />
        </QueryClientProvider>
      </ThemeProvider>
    </RootDocument>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

type Context = {
  config: Config;
};

export const Route = createRootRouteWithContext<Context>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
});
