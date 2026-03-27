import type { drizzle } from "drizzle-orm/node-postgres";

type Db = ReturnType<typeof drizzle>;

export type { Db };
