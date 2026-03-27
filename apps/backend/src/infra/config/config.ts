import { either as e } from "fp-ts";
import * as z from "zod";

import { zAuthConfig } from "./auth";
import { zBcryptConfig } from "./bcrypt";
import { zClientAppConfig } from "./client-app";
import { zCookieConfig } from "./cookie";
import { zCorsConfig } from "./cors";
import { zDrizzleConfig } from "./drizzle";
import { zServerConfig } from "./server";

const zConfig = z
  .object({
    NODE_ENV: z.enum(["dev", "prod"]),
    auth: zAuthConfig,
    bcrypt: zBcryptConfig,
    clientApp: zClientAppConfig,
    cookie: zCookieConfig,
    cors: zCorsConfig,
    drizzle: zDrizzleConfig,
    server: zServerConfig,
  })
  .transform(({ NODE_ENV, ...rest }) => ({
    nodeEnv: NODE_ENV,
    ...rest,
  }));
type Config = z.infer<typeof zConfig>;

function createConfig(
  variables: Record<string, unknown> & { NODE_ENV?: string | undefined },
): e.Either<Error, Config> {
  return e.tryCatch(
    () =>
      zConfig.parse({
        ...Object.fromEntries(Object.keys(zConfig.in.keyof().enum).map((key) => [key, variables])),
        NODE_ENV: variables.NODE_ENV,
      }),
    (error) => {
      if (error instanceof z.ZodError) {
        return new Error("Failed to create application configuration.", { cause: error });
      }
      throw error;
    },
  );
}

export { createConfig, zConfig };
export type { Config };
