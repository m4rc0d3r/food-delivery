import { createRouter } from "@tanstack/react-router";
import { either } from "fp-ts";

import { routeTree } from "./routeTree.gen";
import { createConfig } from "./shared/config";

declare module "@tanstack/react-router" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

const eitherConfig = createConfig({
  ...import.meta.env,
  ...(import.meta.env.DEV && { NODE_ENV: "dev" }),
  ...(import.meta.env.PROD && { NODE_ENV: "prod" }),
});
if (either.isLeft(eitherConfig)) throw eitherConfig.left;

const config = eitherConfig.right;

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      config,
    },
  });

  return router;
}
