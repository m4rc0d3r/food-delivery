import { zArrayable, zBooleanishString } from "@workspace/core";
import * as z from "zod";

const zCorsConfig = z
  .object({
    CORS_ORIGIN: zArrayable(z.url()),
    CORS_CREDENTIALS: zBooleanishString,
  })
  .transform(({ CORS_ORIGIN, CORS_CREDENTIALS }) => ({
    origin: CORS_ORIGIN,
    credentials: CORS_CREDENTIALS,
  }));
type CorsConfig = z.infer<typeof zCorsConfig>;

export { zCorsConfig };
export type { CorsConfig };
