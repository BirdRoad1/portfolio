import { envSchema } from "./schema/env-schema";

try {
  await import("dotenv/config");
  console.log("Loaded .env file");
} catch {}

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.log(
    "Environment variables are not setup correctly. Error(s):",
    parsed.error
  );

  process.exit(1);
}

export const env = parsed.data;
