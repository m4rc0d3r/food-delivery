import * as z from "zod";

const zBackendAppConfig = z
  .object({
    BACKEND_APP_PROTOCOL: z.string().nonempty(),
  })
  .transform(({ BACKEND_APP_PROTOCOL }) => ({
    protocol: BACKEND_APP_PROTOCOL,
  }));
type BackendAppConfig = z.infer<typeof zBackendAppConfig>;

export { zBackendAppConfig };
export type { BackendAppConfig };
