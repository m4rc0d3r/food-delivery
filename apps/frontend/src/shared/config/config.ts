import { either as e } from "fp-ts";
import * as z from "zod";

import { zBackendAppConfig } from "./backend-app";

const zConfig = z
  .object({
    NODE_ENV: z.enum(["dev", "prod"]),
    backendApp: zBackendAppConfig,
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
