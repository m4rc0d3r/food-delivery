import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { zDrizzleConfig } from "./src/infra/config/drizzle";

expand(dotenvConfig());

export default defineConfig({
  out: "./drizzle",
  schema: "./src/infra/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: zDrizzleConfig.parse(process.env).databaseUrl,
  },
});
