import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env";

const shouldUseSsl = (() => {
  if (env.DB_SSL === "true") return true;
  if (env.DB_SSL === "false") return false;
  // auto: enable in prod or when the URL asks for it
  if (env.NODE_ENV === "prod") return true;
  return /sslmode=require/.test(env.DATABASE_URL);
})();

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT_MS,
  statement_timeout: env.DB_STATEMENT_TIMEOUT_MS,
  // In prod we want to verify the cert chain by default; allow override via env.
  ssl: shouldUseSsl ? { rejectUnauthorized: env.NODE_ENV === "prod" } : undefined,
});

pool.on("error", (err) => {
  // node-postgres emits this when an idle client errors out — log and let the
  // pool replace it. Crashing the process here would lose in-flight requests.
  // eslint-disable-next-line no-console
  console.error("[pg.pool] idle client error", err);
});

export const db = drizzle(pool);

export async function closeDb(): Promise<void> {
  await pool.end();
}

export * from "drizzle-orm";
export default db;
