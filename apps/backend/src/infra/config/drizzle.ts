import { z } from "zod";

const zDrizzleConfig = z
  .object({
    DRIZZLE_DATABASE_URL: z.string().url(),
    DRIZZLE_CASING: z.enum(["snake_case", "camelCase"]),
  })
  .transform(({ DRIZZLE_DATABASE_URL, DRIZZLE_CASING }) => ({
    databaseUrl: DRIZZLE_DATABASE_URL,
    casing: DRIZZLE_CASING,
  }));
type DrizzleConfig = z.infer<typeof zDrizzleConfig>;

export { zDrizzleConfig };
export type { DrizzleConfig };
