import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().describe("DB URL"),
  NODE_ENV: z.enum(["development", "prod"]).default("development"),
  DB_POOL_MAX: z.coerce.number().int().min(1).max(200).default(10),
  DB_IDLE_TIMEOUT_MS: z.coerce.number().int().nonnegative().default(30_000),
  DB_CONNECTION_TIMEOUT_MS: z.coerce.number().int().nonnegative().default(10_000),
  DB_STATEMENT_TIMEOUT_MS: z.coerce.number().int().nonnegative().default(15_000),
  DB_SSL: z.enum(["true", "false", "auto"]).default("auto"),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
