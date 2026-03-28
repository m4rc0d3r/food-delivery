import type { App } from "backend";
import { hc } from "hono/client";

type HonoClient = ReturnType<typeof hc<App>>;

type Options = Parameters<typeof hc<App>>[1];

function createHonoClient(baseUrl: string, options?: Options) {
  const client = hc<App>(baseUrl, options);

  return client;
}

export { createHonoClient };
export type { HonoClient };
