import { z } from "zod";

const zBackendAppConfig = z
  .object({
    VITE_BACKEND_APP_PROTOCOL: z.string().nonempty(),
    VITE_BACKEND_APP_ADDRESS: z.string().nonempty(),
    VITE_BACKEND_APP_PORT: z.preprocess((value) => {
      if (typeof value === "number") return value;

      if (typeof value === "string") return value.length > 0 ? Number(value) : undefined;

      return value;
    }, z.number().positive().optional()),
  })
  .transform(({ VITE_BACKEND_APP_PROTOCOL, VITE_BACKEND_APP_ADDRESS, VITE_BACKEND_APP_PORT }) => ({
    protocol: VITE_BACKEND_APP_PROTOCOL,
    address: VITE_BACKEND_APP_ADDRESS,
    port: VITE_BACKEND_APP_PORT,
  }));
type BackendAppConfig = z.infer<typeof zBackendAppConfig>;

export { zBackendAppConfig };
export type { BackendAppConfig };
